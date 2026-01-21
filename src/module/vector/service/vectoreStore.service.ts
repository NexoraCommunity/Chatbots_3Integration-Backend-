import {
  Injectable,
  InternalServerErrorException,
  BadRequestException,
  OnModuleInit,
} from '@nestjs/common';
import { QdrantClient } from '@qdrant/js-client-rest';
import { DocumentReaderService } from '../../embedding/service/documentReader.service';
import { XenovaEmbeddings } from '../../embedding/service/xenovaEmbbeding.service';
import { RecursiveCharacterTextSplitter } from '@langchain/textsplitters';
import { randomUUID } from 'crypto';
import { Decimal } from '@prisma/client/runtime/library';
import { ProductWithVariants } from 'src/model/product.model';
import { OpenAiEmbbedingService } from 'src/module/embedding/service/openAIEmbedding.service';

@Injectable()
export class VectorStoreService implements OnModuleInit {
  constructor(
    private documentReaderService: DocumentReaderService,
    private xenovaEmbbeding: XenovaEmbeddings,
    private readonly openAiEmbeddingService: OpenAiEmbbedingService,
  ) {}

  private client = new QdrantClient({
    url: process.env.QDRANT_URL || 'http://localhost:6333',
  });

  private splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 350,
    chunkOverlap: 50,
    separators: ['\n# ', '\n## ', '\n### ', '\n\n', '\n', ' ', ''],
  });

  private vectorSize: number;

  async getVectorSize(): Promise<number> {
    if (this.vectorSize) return this.vectorSize;

    // const embedding = await this.xenovaEmbbeding.embedDocuments(['ping']);
    const embedding = await this.openAiEmbeddingService.embedDocuments([
      'ping',
    ]);
    this.vectorSize = embedding[0].length;

    return this.vectorSize;
  }
  async onModuleInit() {
    const size = 3072;

    await this.ensureCollection('AgentUserProduct', size);
    await this.ensureCollection('AgentUserDocument', size);
  }
  private validateVector(vector: number[]) {
    if (!Array.isArray(vector) || vector.length === 0) {
      throw new BadRequestException('Vector is empty or invalid');
    }

    if (!vector.every((v) => typeof v === 'number')) {
      throw new BadRequestException('Vector must be an array of numbers');
    }
  }

  private validateBatch(
    vectors: number[][],
    ids: string[],
    payloads: Record<string, any>[],
  ) {
    if (!vectors.length) {
      throw new BadRequestException('Vectors batch is empty');
    }

    if (vectors.length !== ids.length || vectors.length !== payloads.length) {
      throw new BadRequestException(
        'Vectors, ids, and payloads length mismatch',
      );
    }

    vectors.forEach((v, i) => {
      if (!Array.isArray(v) || v.length === 0) {
        throw new BadRequestException(`Invalid vector at index ${i}`);
      }
    });
  }

  private handleQdrantError(error: any) {
    if (error?.status === 400) {
      throw new BadRequestException(
        error?.data?.status?.error || 'Invalid request to vector store',
      );
    }

    throw new InternalServerErrorException('Vector store operation failed');
  }

  /* =========================
     Collection
  ========================= */

  async ensureCollection(name: string, size: number) {
    try {
      const { collections } = await this.client.getCollections();

      if (!collections.find((c) => c.name === name)) {
        await this.client.createCollection(name, {
          vectors: {
            size,
            distance: 'Cosine',
          },
        });
      }
    } catch (error) {
      this.handleQdrantError(error);
    }
  }

  /* =========================
     Store One
  ========================= */

  async storeOne(
    vector: number[],
    collection: string,
    id: string,
    payload: Record<string, any>,
  ) {
    this.validateVector(vector);

    if (!id) {
      throw new BadRequestException('Point id is required');
    }

    try {
      await this.client.upsert(collection, {
        points: [
          {
            id,
            vector,
            payload,
          },
        ],
      });
    } catch (error) {
      this.handleQdrantError(error);
    }
  }

  /* =========================
     Store Many
  ========================= */

  async storeMany(
    vectors: number[][],
    collection: string,
    ids: string[],
    payloads: Record<string, any>[],
  ) {
    this.validateBatch(vectors, ids, payloads);

    const CHUNK_SIZE = 50;
    const RETRY = 3;

    for (let i = 0; i < vectors.length; i += CHUNK_SIZE) {
      const points = vectors.slice(i, i + CHUNK_SIZE).map((vector, idx) => ({
        id: ids[i + idx],
        vector,
        payload: payloads[i + idx],
      }));

      let attempt = 0;
      while (attempt < RETRY) {
        try {
          await this.client.upsert(collection, {
            points,
            wait: true,
          });
          break;
        } catch (error: any) {
          attempt++;
          if (
            error?.cause?.code === 'ECONNRESET' ||
            error?.cause?.code === 'ETIMEDOUT'
          ) {
            if (attempt >= RETRY) {
              this.handleQdrantError(error);
            }
            await new Promise((r) => setTimeout(r, 1000 * attempt));
          } else {
            this.handleQdrantError(error);
          }
        }
      }
    }
  }

  /* =========================
     DELETE BY FILTER (NEW)
  ========================= */

  async deleteByFilter(collection: string, filter: any) {
    try {
      await this.client.delete(collection, {
        filter,
      });
    } catch (error) {
      console.log(error);
      this.handleQdrantError(error);
    }
  }

  /* =========================
     Search
  ========================= */

  async similaritySearch(
    vector: number[],
    collection: string,
    filter?: any,
    limit = 5,
  ) {
    this.validateVector(vector);

    try {
      return await this.client.search(collection, {
        vector,
        limit,
        filter,
      });
    } catch (error) {
      this.handleQdrantError(error);
    }
  }

  async searchByFilter(collection: string, filter?: any) {
    try {
      return await this.client.scroll(collection, {
        filter,
        with_payload: true,
        with_vector: false,
      });
    } catch (error) {
      this.handleQdrantError(error);
    }
  }

  /* =========================
     Store Vector Document 
  ========================= */

  async storeVectorFile(filePath: string, agentId: string, userId: string) {
    const document = await this.documentReaderService.read(filePath);
    const splitedText = await this.splitter.createDocuments([document]);

    const texts = splitedText.map((d) => d.pageContent);

    const embeddings: number[][] = [];
    const BATCH_SIZE = 20;

    for (let i = 0; i < texts.length; i += BATCH_SIZE) {
      const batch = texts.slice(i, i + BATCH_SIZE);
      // const batchEmbedding = await this.xenovaEmbbeding.embedDocuments(batch);
      const batchEmbedding =
        await this.openAiEmbeddingService.embedDocuments(batch);

      if (batchEmbedding) embeddings.push(...batchEmbedding);
    }

    const ids = splitedText.map(() => randomUUID());

    const payloads = splitedText.map((chunk, i) => ({
      userId,
      documentId: agentId,
      chunkIndex: i,
      source: filePath,
      text: chunk.pageContent,
    }));

    await this.storeMany(embeddings, 'AgentUserDocument', ids, payloads);
  }

  /* =========================
  Store Vector DataTrain / Prompt
  ========================= */

  async storeVectorDataTrain(
    DataTrain: string,
    agentId: string,
    userId: string,
  ) {
    const splitedText = await this.splitter.createDocuments([DataTrain]);

    const texts = splitedText.map((d) => d.pageContent);

    const embeddings = await this.openAiEmbeddingService.embedDocuments(texts);

    const ids = splitedText.map(() => randomUUID());

    const payloads = splitedText.map((chunk, i) => ({
      userId: userId,
      DataId: agentId,
      chunkIndex: i,
      text: chunk.pageContent,
    }));

    await this.storeMany(embeddings, 'AgentUserDataTrain', ids, payloads);
  }

  /* =========================
     Store Vector Product 
  ========================= */

  async storeVectorProduct(
    products: ProductWithVariants[],
    agentId: string,
    userId: string,
  ) {
    const texts = products.map(this.serializeProductForEmbedding);

    // const embeddings = await this.xenovaEmbbeding.embedDocuments(texts);
    const embeddings = await this.openAiEmbeddingService.embedDocuments(texts);

    if (embeddings)
      for (let i = 0; i < products.length; i++) {
        await this.storeOne(embeddings[i], 'AgentUserProduct', products[i].id, {
          type: 'product',
          agentId,
          userId,
          productId: products[i].id,
          categoryId: products[i].categoryId,
          isActive: products[i].isActive,
          sku: products[i].sku,
          price: Number(products[i].price),
          stock: products[i].stock,
          hasVariant: products[i].productVariants.length > 0,
        });
      }
  }

  formatPrice(price: Decimal | number) {
    return typeof price === 'number' ? price : Number(price.toString());
  }
  serializeProductForEmbedding(product: ProductWithVariants): string {
    const optionText = product.variantOptions.length
      ? product.variantOptions
          .map(
            (opt) =>
              `${opt.name}: ${opt.values.map((v) => v.value).join(', ')}`,
          )
          .join(' | ')
      : 'Tidak ada';

    const variantText = product.productVariants.length
      ? product.productVariants
          .map((variant) => {
            const values = variant.values.map((v) => v.value.value).join(', ');

            return `
              SKU: ${variant.sku}
              Harga: ${variant.price}
              Stok: ${variant.stock}
              Varian: ${values}
              `.trim();
          })
          .join('\n---\n')
      : 'Tidak ada varian';

    return `
          Produk: ${product.name}
          Deskripsi: ${product.description}
          Kategori: ${product.categoryId}
          SKU Utama: ${product.sku}
          Harga Dasar: ${product.price}
          Stok Total: ${product.stock}

          Opsi Varian:
          ${optionText}

          Detail Varian:
          ${variantText}
          `.trim();
  }
}
