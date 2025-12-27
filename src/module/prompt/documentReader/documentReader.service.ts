import { Injectable } from '@nestjs/common';
import fs from 'fs';
import path from 'path';
import pdf from 'pdf-parse';
import mammoth from 'mammoth';
import XLSX from 'xlsx';
import { Document } from '@langchain/core/documents';

@Injectable()
export class DocumentReaderService {
  async read(filePath: string): Promise<string> {
    const ext = path.extname(filePath).toLowerCase().replace('.', '');

    let text = '';

    switch (ext) {
      case 'txt':
        text = this.readTxt(filePath);
        break;

      case 'pdf':
        text = await this.readPdf(filePath);
        break;

      case 'docx':
        text = await this.readDocx(filePath);
        break;

      case 'csv':
      case 'xlsx':
      case 'xls':
        text = this.readExcel(filePath);
        break;

      default:
        throw new Error(`Unsupported format: ${ext}`);
    }

    return text;
  }

  private readTxt(filePath: string): string {
    return fs.readFileSync(filePath, 'utf-8');
  }

  private async readPdf(filePath: string): Promise<string> {
    const buffer = fs.readFileSync(filePath);
    const data = await pdf(buffer);
    return data.text;
  }

  private async readDocx(filePath: string): Promise<string> {
    const buffer = fs.readFileSync(filePath);
    const result = await mammoth.extractRawText({ buffer });
    return result.value;
  }

  private readExcel(filePath: string): string {
    const workbook = XLSX.readFile(filePath, { dense: true });
    let output = '';

    for (const sheetName of workbook.SheetNames) {
      const sheet = workbook.Sheets[sheetName];
      const rows = XLSX.utils.sheet_to_json(sheet, { header: 1 });

      rows.forEach((row: any) => {
        output += row.join(' ') + '\n';
      });
    }

    return output;
  }
}
