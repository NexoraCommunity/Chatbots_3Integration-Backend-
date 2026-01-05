import { diskStorage } from 'multer';
import { extname } from 'path';
import { BadRequestException } from '@nestjs/common';
import { promises as fs } from 'fs';
import path from 'path';

export const imageMulterConfig = {
  storage: diskStorage({
    destination: path.join(process.cwd(), 'uploads', 'temp'),
    filename: async (req, file, cb) => {
      const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1e9);
      cb(null, uniqueName + extname(file.originalname));
    },
  }),

  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) {
      return cb(new BadRequestException('Only image files are allowed'), false);
    }
    cb(null, true);
  },

  limits: {
    fileSize: 10 * 1024 * 1024,
  },
};

const allowedMimeTypes = [
  'text/plain',
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/vnd.oasis.opendocument.spreadsheet',
];

export const tempFileMulterConfig = {
  storage: diskStorage({
    destination: path.join(process.cwd(), 'uploads', 'temp'),
    filename: async (req, file, cb) => {
      const unique = Date.now() + '-' + Math.random().toString(36).substring(2);
      cb(null, unique + extname(file.originalname));
    },
  }),

  fileFilter: (req, file, cb) => {
    if (!allowedMimeTypes.includes(file.mimetype)) {
      return cb(new BadRequestException('File type not allowed'), false);
    }
    cb(null, true);
  },

  limits: {
    fileSize: 100 * 1024 * 1024,
  },
};

export const moveFile = async (
  tempRelativePath: string,
  targetFolder: 'file' | 'image' | 'temp',
): Promise<string> => {
  const sourcePath = path.resolve(process.cwd(), tempRelativePath);

  const fileName = path.basename(sourcePath);

  const targetDir = path.resolve(process.cwd(), 'uploads', targetFolder);

  await fs.mkdir(targetDir, { recursive: true });

  const targetPath = path.join(targetDir, fileName);

  await fs.rename(sourcePath, targetPath);

  return `uploads/${targetFolder}/${fileName}`;
};
