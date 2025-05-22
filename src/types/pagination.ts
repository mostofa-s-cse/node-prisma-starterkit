import { RowDataPacket } from 'mysql2/promise';

// Pagination response types
export interface PaginationMeta {
  total: number;
  totalPages: number;
  currentPage: number;
  perPage: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  nextPage: number | null;
  previousPage: number | null;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: PaginationMeta;
}

// Database model types
export interface User extends RowDataPacket {
  id: number;
  email: string;
  name: string;
  createdAt: Date;
  active: boolean;
}

// Prisma types
export interface PrismaWhere {
  [key: string]: any;
}

export interface PrismaSelect {
  [key: string]: boolean;
}

export interface PrismaOrderBy {
  [key: string]: 'asc' | 'desc';
}

// MySQL and PostgreSQL types
export interface DatabaseConfig {
  host: string;
  user: string;
  password: string;
  database: string;
  port?: number;
}

export interface QueryOptions {
  page?: number;
  perPage?: number;
  where?: string;
  select?: string;
  orderBy?: string;
} 