import { Embeddings } from '@langchain/core/embeddings';
import { Injectable } from '@nestjs/common';
import { pipeline } from '@xenova/transformers';

@Injectable()
export class XenovaEmbeddings extends Embeddings {
  private static extractor: any;

  private async getExtractor() {
    if (!XenovaEmbeddings.extractor) {
      XenovaEmbeddings.extractor = await pipeline(
        'feature-extraction',
        'Xenova/all-MiniLM-L6-v2',
      );
    }
    return XenovaEmbeddings.extractor;
  }

  async embedDocuments(texts: string[]): Promise<number[][]> {
    const extractor = await this.getExtractor();
    const embeddings: number[][] = [];

    for (const text of texts) {
      const output = await extractor(text, {
        pooling: 'mean',
        normalize: true,
      });
      embeddings.push(Array.from(output.data));
    }

    return embeddings;
  }

  async embedQuery(text: string): Promise<number[]> {
    const extractor = await this.getExtractor();
    const output = await extractor(text, {
      pooling: 'mean',
      normalize: true,
    });

    return Array.from(output.data);
  }
}
