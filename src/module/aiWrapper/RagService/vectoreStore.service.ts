import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { QdrantClient } from '@qdrant/js-client-rest';

@Injectable()
export class vectorStoreService {
  constructor(
    private readonly configService: ConfigService,
    private client = new QdrantClient({
      url: `http://localhost:${this.configService.get('QDRANT')}`,
    }),
  ) {}

  async store(
    vector: number[][],
    collection: string,
    uniqueID: string,
    text: string,
  ) {
    const exists = await this.client.getCollections();

    if (!exists.collections.find((c) => c.name === collection)) {
      await this.client.createCollection(collection, {
        vectors: {
          size: 384,
          distance: 'Cosine',
        },
      });
    }

    await this.client.upsert(collection, {
      points: [
        {
          id: uniqueID,
          vector,
          payload: {
            user_prompt_id: uniqueID,
            text,
            created_at: new Date().toISOString(),
          },
        },
      ],
    });
  }

  async search(vector: number[], collection: string, uniqueID: string) {
    const result = await this.client.search(collection, {
      vector: vector,
      limit: 5,
      filter: {
        must: [
          {
            key: 'user_prompt_id',
            match: { value: uniqueID },
          },
        ],
      },
    });
  }
}
