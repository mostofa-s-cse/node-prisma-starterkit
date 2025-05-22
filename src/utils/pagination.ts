import { Request } from 'express';

export interface PaginationOptions {
  perPage?: number;
  pageName?: string;
  columns?: string[];
  include?: Record<string, any>;
  orderBy?: Record<string, any>;
}

export interface PaginationResult<T> {
  data: T[];
  pagination: {
    currentPage: number;
    perPage: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    nextPage: number | null;
    previousPage: number | null;
  };
}

export async function simplePaginate<T>(
  model: any,
  req: Request,
  options: PaginationOptions = {}
): Promise<PaginationResult<T>> {
  const {
    perPage = 15,
    pageName = 'page',
    include,
    orderBy
  } = options;

  const page = parseInt(req.query[pageName] as string) || 1;
  const skip = (page - 1) * perPage;
  const take = perPage + 1;

  const results = await model.findMany({
    skip,
    take,
    include,
    orderBy
  });

  const hasNextPage = results.length > perPage;
  const data = hasNextPage ? results.slice(0, perPage) : results;

  return {
    data,
    pagination: {
      currentPage: page,
      perPage,
      hasNextPage,
      hasPreviousPage: page > 1,
      nextPage: hasNextPage ? page + 1 : null,
      previousPage: page > 1 ? page - 1 : null
    }
  };
}
