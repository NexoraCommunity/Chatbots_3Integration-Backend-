import { HttpException, Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class OtherEmbedding {
  constructor() {}

  async embedQuery(text: string) {
    try {
      const body = {
        text: text,
      };

      const res = await axios.post(`http://127.0.0.1:8000/embed/asmud`, body);

      return res.data.embedding;
    } catch (error) {
      throw new HttpException('Internal Server Error', 500);
    }
  }
  async embedDocuments(texts: string[]) {
    try {
      const body = {
        texts: texts,
      };

      const res = await axios.post(
        `http://127.0.0.1:8000/embed-docs/asmud`,
        body,
      );

      return res.data.embeddings;
    } catch (error) {
      throw new HttpException('Internal Server Error', 500);
    }
  }
}
