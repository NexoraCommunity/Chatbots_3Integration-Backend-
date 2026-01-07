import {
  Controller,
  HttpCode,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import path from 'path';
import {
  imageMulterConfig,
  tempFileMulterConfig,
} from 'src/interceptors/multer.interceptors';

@Controller('api')
export class CommonController {
  @Post('upload/file')
  @UseInterceptors(FileInterceptor('file', tempFileMulterConfig))
  @HttpCode(200)
  async uploadFile(@UploadedFile() file?: Express.Multer.File) {
    const filename = file?.filename ?? null;
    const filePath = path.join('uploads', 'file', filename || '');

    return filename ? filePath.replaceAll('\\', '/') : null;
  }

  @Post('upload/image')
  @UseInterceptors(FileInterceptor('file', imageMulterConfig))
  @HttpCode(200)
  async uploadImage(@UploadedFile() file?: Express.Multer.File) {
    const filename = file?.filename ?? null;
    const filePath = path.join('uploads', 'image', filename || '');

    return filename ? filePath.replaceAll('\\', '/') : null;
  }
}
