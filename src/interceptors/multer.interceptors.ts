import { diskStorage } from 'multer';
import { extname } from 'path';
import { BadRequestException } from '@nestjs/common';
import { promises as fs } from 'fs';
import path from 'path';

export const imageMulterConfig = {
  storage: diskStorage({
    destination: '/uploads/images',
    filename: async (req, file, cb) => {
      if (req.params.id) {
        if (req.body.image) {
          await moveFiletoTemp(req.body.image);
        } else {
          await moveFiletoTemp(req.body.picture);
        }
      }

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
    destination: '/uploads/file',
    filename: async (req, file, cb) => {
      if (req.params.id) {
        await moveFiletoTemp(req.body.filePath);
      }
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

export const moveFiletoTemp = async (sourceDir: string): Promise<void> => {
  const targetDir = path.join(process.cwd(), 'uploads', 'temp');

  await fs.mkdir(targetDir, { recursive: true });

  const files = await fs.readdir(sourceDir);
  if (!files.length) throw new Error('Source directory is empty');

  const fileName = files[0];
  const sourcePath = path.join(sourceDir, fileName);
  const targetPath = path.join(targetDir, fileName);

  await fs.rename(sourcePath, targetPath);
};
