import mysql, { RowDataPacket } from 'mysql2/promise';
import { Pool } from 'pg';
import { PrismaClient } from '@prisma/client';
import {
  PaginatedResponse,
  User,
  PrismaWhere,
  PrismaSelect,
  PrismaOrderBy
} from '../types/pagination';

const prisma = new PrismaClient();

const mysqlPool = mysql.createPool({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

const pgPool = new Pool({
  host: process.env.POSTGRES_HOST,
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  port: parseInt(process.env.POSTGRES_PORT || '5432'),
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// ===============================
// Prisma Pagination
// ===============================
export async function prismaPaginate<T>(
  model: any,
  page = 1,
  perPage = 10,
  where: PrismaWhere = {},
  select: PrismaSelect | null = null,
  orderBy: PrismaOrderBy = { id: 'desc' }
): Promise<PaginatedResponse<T>> {
  const skip = (page - 1) * perPage;

  const [total, data] = await Promise.all([
    model.count({ where }),
    model.findMany({ where, select, skip, take: perPage, orderBy })
  ]);

  return buildPaginationResponse<T>(data, total, page, perPage);
}

// ===============================
// MySQL Pagination
// ===============================
export async function mysqlPaginate<T extends RowDataPacket>(
  tableName: string,
  page = 1,
  perPage = 10,
  where = '1=1',
  select = '*',
  orderBy = 'id DESC'
): Promise<PaginatedResponse<T>> {
  const offset = (page - 1) * perPage;

  const [countResult, [rows]] = await Promise.all([
    mysqlPool.query(`SELECT COUNT(1) as total FROM \`${tableName}\` WHERE ${where}`),
    mysqlPool.query<T[]>(
      `SELECT ${select} FROM \`${tableName}\`
       WHERE ${where}
       ORDER BY ${orderBy}
       LIMIT ? OFFSET ?`,
      [perPage, offset]
    )
  ]);

  const total = (countResult[0] as any)[0]?.total ?? 0;
  return buildPaginationResponse<T>(rows, total, page, perPage);
}

// ===============================
// PostgreSQL Pagination
// ===============================
export async function postgresPaginate<T>(
  tableName: string,
  page = 1,
  perPage = 10,
  where = '1=1',
  select = '*',
  orderBy = 'id DESC'
): Promise<PaginatedResponse<T>> {
  const offset = (page - 1) * perPage;

  const [countResult, data] = await Promise.all([
    pgPool.query(`SELECT COUNT(1) AS total FROM ${tableName} WHERE ${where}`),
    pgPool.query(
      `SELECT ${select} FROM ${tableName}
       WHERE ${where}
       ORDER BY ${orderBy}
       LIMIT $1 OFFSET $2`,
      [perPage, offset]
    )
  ]);

  const total = parseInt(countResult.rows[0]?.total ?? '0');
  return buildPaginationResponse<T>(data.rows, total, page, perPage);
}

// ===============================
// Shared Pagination Response
// ===============================
function buildPaginationResponse<T>(
  data: T[],
  total: number,
  currentPage: number,
  perPage: number
): PaginatedResponse<T> {
  const totalPages = Math.ceil(total / perPage);

  return {
    data,
    pagination: {
      total,
      totalPages,
      currentPage,
      perPage,
      hasNextPage: currentPage < totalPages,
      hasPreviousPage: currentPage > 1,
      nextPage: currentPage < totalPages ? currentPage + 1 : null,
      previousPage: currentPage > 1 ? currentPage - 1 : null,
    }
  };
}

// ===============================
// Example Usage
// ===============================
export async function getUsers(page = 1, perPage = 10): Promise<PaginatedResponse<User>> {
  return prismaPaginate<User>(
    prisma.user,
    page,
    perPage,
    { active: true },
    { id: true, email: true, name: true, createdAt: true },
    { createdAt: 'desc' }
  );
}

export async function getMySQLUsers(page = 1, perPage = 10): Promise<PaginatedResponse<User>> {
  return mysqlPaginate<User>(
    'users',
    page,
    perPage,
    'active = 1',
    'id, email, name, created_at',
    'created_at DESC'
  );
}

export async function getPostgresUsers(page = 1, perPage = 10): Promise<PaginatedResponse<User>> {
  return postgresPaginate<User>(
    'users',
    page,
    perPage,
    'active = true',
    'id, email, name, created_at',
    'created_at DESC'
  );
}

// ===============================
// Graceful Connection Shutdown
// ===============================
export async function closeConnections(): Promise<void> {
  await Promise.all([
    prisma.$disconnect(),
    mysqlPool.end(),
    pgPool.end()
  ]);
}
