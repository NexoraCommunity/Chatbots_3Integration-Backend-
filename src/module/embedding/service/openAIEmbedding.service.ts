import { HttpException, Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class OpenAiEmbbedingService {
  private apiKey = process.env.OPENAI_API_KEY;
  async embedQuery(text: string) {
    try {
      const response = await axios.post(
        'https://api.openai.com/v1/embeddings',
        {
          model: 'text-embedding-3-large',
          input: text,
        },
        {
          headers: {
            Authorization: `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
          },
        },
      );

      const embedding = response.data.data[0].embedding;

      return embedding;
    } catch (error) {
      throw new HttpException('Internal Server Error', 500);
    }
  }

  async embedDocuments(texts: string[]) {
    try {
      const response = await axios.post(
        'https://api.openai.com/v1/embeddings',
        {
          model: 'text-embedding-3-large',
          input: texts,
        },
        {
          headers: {
            Authorization: `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
          },
        },
      );

      return response.data.data.map((d) => d.embedding);
    } catch (error) {
      console.error(error.response?.data || error.message);
      throw new HttpException('Internal Server Error', 500);
    }
  }
}
