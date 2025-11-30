import { Product } from '@prisma/client';
import { Pagination } from './web.model';

export class ProductApi {
  name: string;
  description: string;
  price: number;
  image: string;
  stock: number;
  sku: string;
  weight: number | null;
}

export class PostProduct {
  name: string;
  description: string;
  price: number;
  image: string;
  stock: number;
  sku: string;
  weight: number | null;
  userId: string;
  categoryId: string;
}
export class ChangeProduct {
  id: string;
  categoryId: string;
  name: string;
  description: string;
  price: number;
  image: string;
  stock: number;
  sku: string;
  weight: number | null;
}

export class GetModelProduct {
  userId?: string;
  categoryId?: string;
  page: string;
  limit: string;
}

export class PaginationResponseProduct {
  Product: Product[];
  Pagination: Pagination;
}
