import { Pagination } from './web.model';
import { Agent } from '@prisma/client';

export class AgentApi {
  name: string;
  agent: string;
  dataTrain: string | null;
  llm: string;
  filePath: string;
}

export class changeAgent {
  id: string;
  name: string;
  dataTrain: string | null;
  agent: string;
  llm: string;
  filePath: string;
}
export class postAgent {
  userId: string;
  name: string;
  agent: string;
  llm: string;
  filePath: string;
  dataTrain: string | null;
}

export class GetModelAgent {
  userId?: string;
  page: string;
  limit: string;
}

export class PaginationResponseAgent {
  Agent: Agent[];
  Pagination: Pagination;
}
