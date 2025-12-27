import { Pagination } from './web.model';
import { Prompt } from '@prisma/client';

export class PromptApi {
  name: string;
  prompt: string;
  llm: string;
  filePath: string;
}

export class changePrompt {
  id: string;
  name: string;
  prompt: string;
  llm: string;
  filePath: string;
}
export class postPrompt {
  userId: string;
  name: string;
  llm: string;
  filePath: string;
  prompt: string;
}

export class GetModelPrompt {
  userId?: string;
  page: string;
  limit: string;
}

export class PaginationResponsePrompt {
  Prompt: Prompt[];
  Pagination: Pagination;
}
