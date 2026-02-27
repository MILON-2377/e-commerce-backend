/* eslint-disable @typescript-eslint/no-explicit-any */
export interface QueryParams {
  search?: string;
  sort?: string;
  page?: string;
  limit?: string;

  [key: string]: unknown;
}

export interface PrismaQueryState {
  where?: Record<string, any>;
  orderBy?:
    | Record<string, "asc" | "desc">
    | Array<Record<string, "asc" | "desc">>;

  skip?: number;
  take?: number;
}

export interface IQueryBuilder<T> {
  where(condition: Record<string, any>): IQueryBuilder<T>;
  search(fields: string[]): IQueryBuilder<T>;
  filter(excludedFields?: string[]): IQueryBuilder<T>;
  sort(defaultSort?: string): IQueryBuilder<T>;
  paginate(): IQueryBuilder<T>;

  exec(): Promise<T[]>;
}
