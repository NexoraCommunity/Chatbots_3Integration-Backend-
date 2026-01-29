import {
  Injectable,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { RecursiveCharacterTextSplitter } from '@langchain/textsplitters';
import { randomUUID } from 'crypto';
import { DocumentReaderService } from '../../embedding/service/documentReader.service';
import { OpenAiEmbbedingService } from 'src/module/embedding/service/openAIEmbedding.service';
import { ProductWithVariants } from 'src/model/product.model';
import { Decimal } from '@prisma/client/runtime/library';

// RPC function names for similarity search (with match_ prefix)
const VECTOR_RPC_MAP: Record<string, string> = {
  AgentUserDocument: 'match_agent_user_document',
  AgentUserProduct: 'match_agent_user_product',
  AgentUserDataTrain: 'match_agent_user_data_train',
};

// Table names for direct queries (search/delete)
const VECTOR_TABLE_MAP: Record<string, string> = {
  AgentUserDocument: 'agent_user_document',
  AgentUserProduct: 'agent_user_product',
  AgentUserDataTrain: 'agent_user_data_train',
};

// Keys that are stored inside the metadata JSONB column
const METADATA_KEYS = new Set(['userId', 'documentId', 'agentId', 'productId', 'categoryId', 'type', 'source', 'chunkIndex', 'sku', 'price', 'stock', 'isActive']);

@Injectable()
export class SupabaseStoreService {
  private supabase: SupabaseClient;

  constructor(
    private documentReaderService: DocumentReaderService,
    private openAiEmbeddingService: OpenAiEmbbedingService,
  ) {
    this.supabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
    );
  }

  private splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 350,
    chunkOverlap: 50,
  });

  private toQdrantLikeResult(rows: any[]) {
    return {
      points: rows.map((row) => ({
        id: row.id,
        payload: {
          ...row,
        },
      })),
    };
  }

  /* ======================
     VALIDATION
  ====================== */

  private validateVector(vector: number[]) {
    if (!Array.isArray(vector) || !vector.length) {
      throw new BadRequestException('Invalid vector');
    }
  }

  /* ======================
     STORE MANY
  ====================== */

  async storeMany(
    embeddings: number[][],
    collection: keyof typeof VECTOR_TABLE_MAP,
    contents: string[],
    metadatas: Record<string, any>[],
  ) {
    const table = VECTOR_TABLE_MAP[collection];
    if (!table) {
      throw new BadRequestException(
        `No table mapping defined for collection ${collection}`,
      );
    }

    if (
      embeddings.length !== contents.length ||
      embeddings.length !== metadatas.length
    ) {
      throw new BadRequestException('Length mismatch');
    }

    const rows = embeddings.map((embedding, i) => ({
      id: randomUUID(),
      embedding,
      content: contents[i],
      metadata: metadatas[i],
    }));

    const { error } = await this.supabase.from(table).insert(rows);

    if (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  /* ======================
     SEARCH
  ====================== */

  async similaritySearch(
    vector: number[],
    collection: keyof typeof VECTOR_RPC_MAP,
    filter:
      | {
          must?: Array<{
            key: string;
            match?: { value: any };
          }>;
        }
      | Record<string, any>,
    limit = 5,
  ) {
    this.validateVector(vector);

    const fn = VECTOR_RPC_MAP[collection];
    if (!fn) {
      throw new BadRequestException(
        `No vector RPC function defined for collection ${collection}`,
      );
    }

    const normalizedFilter = this.normalizeFilter(filter);

    const { data, error } = await this.supabase.rpc(fn, {
      query_embedding: vector,
      match_count: limit,
      filter: normalizedFilter,
    });

    if (error) {
      throw new InternalServerErrorException(error.message);
    }

    return data;
  }
  async searchByFilter(
    collection: keyof typeof VECTOR_TABLE_MAP,
    filter:
      | {
          must?: Array<{
            key: string;
            match?: { value: any };
          }>;
        }
      | Record<string, any>,
  ) {
    const table = VECTOR_TABLE_MAP[collection];
    if (!table) {
      throw new BadRequestException(
        `No table mapping defined for ${collection}`,
      );
    }

    try {
      let query: any = this.supabase.from(table).select('*');

      if ('must' in filter && Array.isArray(filter.must)) {
        for (const clause of filter.must) {
          const value = clause.match?.value;
          if (value === undefined) continue;

          if (clause.key.startsWith('metadata.')) {
            const metaKey = clause.key.replace('metadata.', '');
            query = query.contains('metadata', { [metaKey]: value });
          } else if (METADATA_KEYS.has(clause.key)) {
            // Key is stored inside metadata JSONB
            query = query.contains('metadata', { [clause.key]: value });
          } else {
            query = query.eq(clause.key, value);
          }
        }
      } else if (filter && Object.keys(filter).length) {
        // Fallback to simple key-value filter
        for (const [key, value] of Object.entries(filter)) {
          if (key === 'metadata') {
            query = query.contains('metadata', value);
          } else if (METADATA_KEYS.has(key)) {
            query = query.contains('metadata', { [key]: value });
          } else {
            query = query.eq(key, value);
          }
        }
      }

      const { data, error } = await query;
      if (error) throw error;

      const result = this.toQdrantLikeResult(data);
      return result;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
  /* ======================
     DELETE BY FILTER
  ====================== */

  async deleteByFilter(
    collection: keyof typeof VECTOR_TABLE_MAP,
    filter:
      | {
          must?: Array<{
            key: string;
            match?: { value: any };
          }>;
        }
      | Record<string, any>,
  ) {
    const table = VECTOR_TABLE_MAP[collection];
    if (!table) {
      throw new BadRequestException(
        `No table mapping defined for ${collection}`,
      );
    }

    let query: any = this.supabase.from(table).delete().select('id');

    if ('must' in filter && Array.isArray(filter.must)) {
      for (const clause of filter.must) {
        const value = clause.match?.value;
        if (value === undefined) continue;

        if (clause.key.startsWith('metadata.')) {
          const metaKey = clause.key.replace('metadata.', '');
          query = query.contains('metadata', { [metaKey]: value });
        } else if (METADATA_KEYS.has(clause.key)) {
          // Key is stored inside metadata JSONB
          query = query.contains('metadata', { [clause.key]: value });
        } else {
          query = query.eq(clause.key, value);
        }
      }
    } else if (filter && Object.keys(filter).length) {
      // Fallback to simple key-value filter
      for (const [key, value] of Object.entries(filter)) {
        if (key === 'metadata') {
          query = query.contains('metadata', value);
        } else if (METADATA_KEYS.has(key)) {
          query = query.contains('metadata', { [key]: value });
        } else {
          query = query.eq(key, value);
        }
      }
    }
    
    const { data, error } = await query;

    if (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  /* ======================
     STORE FILE
  ====================== */

  async storeVectorFile(filePath: string, agentId: string, userId: string) {
    const document = await this.documentReaderService.read(filePath);
    const chunks = await this.splitter.createDocuments([document]);

    const texts = chunks.map((d) => d.pageContent);
    const embeddings = await this.openAiEmbeddingService.embedDocuments(texts);

    const metadatas = chunks.map((_, i) => ({
      agentId,
      userId,
      source: filePath,
      chunkIndex: i,
      type: 'document',
    }));

    await this.storeMany(embeddings, 'AgentUserDocument', texts, metadatas);
  }

  /* ======================
     STORE DATA TRAIN
  ====================== */

  async storeVectorDataTrain(
    dataTrain: string,
    agentId: string,
    userId: string,
  ) {
    const chunks = await this.splitter.createDocuments([dataTrain]);
    const texts = chunks.map((d) => d.pageContent);
    const embeddings = await this.openAiEmbeddingService.embedDocuments(texts);

    const metadatas = chunks.map((_, i) => ({
      agentId,
      userId,
      chunkIndex: i,
      type: 'datatrain',
    }));

    await this.storeMany(embeddings, 'AgentUserDataTrain', texts, metadatas);
  }

  /* ======================
     STORE PRODUCT
  ====================== */

  async storeVectorProduct(
    products: ProductWithVariants[],
    agentId: string,
    userId: string,
  ) {
    const texts = products.map(this.serializeProductForEmbedding);
    const embeddings = await this.openAiEmbeddingService.embedDocuments(texts);

    const metadatas = products.map((p) => ({
      type: 'product',
      agentId,
      userId,
      productId: p.id,
      categoryId: p.categoryId,
      isActive: p.isActive,
      sku: p.sku,
      price: Number(p.price),
      stock: p.stock,
    }));

    await this.storeMany(embeddings, 'AgentUserProduct', texts, metadatas);
  }

  serializeProductForEmbedding(product: ProductWithVariants): string {
    return `
Produk: ${product.name}
Deskripsi: ${product.description}
SKU: ${product.sku}
Harga: ${product.price}
Stok: ${product.stock}
    `.trim();
  }

  formatPrice(price: Decimal | number) {
    return typeof price === 'number' ? price : Number(price.toString());
  }

  normalizeFilter(
    filter:
      | {
          must?: Array<{
            key: string;
            match?: { value: any };
          }>;
        }
      | Record<string, any>,
  ): Record<string, any> {
    if (!filter || !('must' in filter)) {
      return filter ?? {};
    }

    const result: Record<string, any> = {};

    for (const clause of filter.must ?? []) {
      const value = clause.match?.value;
      if (value === undefined) continue;

      if (clause.key.startsWith('metadata.')) {
        const metaKey = clause.key.replace('metadata.', '');
        result.metadata ??= {};
        result.metadata[metaKey] = value;
      } else {
        result[clause.key] = value;
      }
    }

    return result;
  }
}
