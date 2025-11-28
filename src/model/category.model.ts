import { Category, Product } from '@prisma/client';
import { Pagination } from './web.model';

export class CategoryApi {
  name: string;
}
export class ChangeCategory {
  id: string;
  name: string;
}

export class GetModelCategory {
  page: string;
  limit: string;
}

export class PaginationResponseCategory {
  Category: Category[];
  Pagination: Pagination;
}
