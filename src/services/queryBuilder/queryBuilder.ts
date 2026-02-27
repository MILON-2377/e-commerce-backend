/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  IQueryBuilder,
  PrismaQueryState,
  QueryParams,
} from "./queryBuilder.types";

export class PrismaQueryBuilder<T> implements IQueryBuilder<T> {
  protected model: PrismaModelDelegate<T>;
  protected query: QueryParams;
  protected prismaQuery: PrismaQueryState;

  constructor(model: PrismaModelDelegate<T>, query: QueryParams) {
    this.model = model;
    this.query = query;

    this.prismaQuery = {};
  }

  where(condition: Record<string, any>): IQueryBuilder<T> {
    if (!this.prismaQuery.where) {
      this.prismaQuery.where = {};
    }

    this.prismaQuery.where = {
      ...this.prismaQuery.where,
      ...condition,
    };

    return this;
  }

  search(fields: string[]): IQueryBuilder<T> {
    const searchTerm = this.query.search;

    if (!searchTerm || fields.length === 0) {
      return this;
    }

    const orConditions = fields.map((field) => ({
      [field]: {
        contains: searchTerm,
        mode: "insensitive",
      },
    }));

    if (!this.prismaQuery.where) {
      this.prismaQuery.where = {};
    }

    if (this.prismaQuery.where.OR || this.prismaQuery.where.AND) {
      this.prismaQuery.where = {
        AND: [this.prismaQuery.where, { OR: orConditions }],
      };
    } else {
      this.prismaQuery.where.OR = orConditions;
    }

    return this;
  }

  filter(excludedFields: string[] = []): IQueryBuilder<T> {
    const excluded = [...DEFAULT_EXCLUDED_FIELDS, ...excludedFields];

    const filters: Record<string, any> = {};

    Object.entries(this.query).forEach(([key, value]) => {
      if (excluded.includes(key)) return;
      if (value === undefined || value === "") return;

      filters[key] = value;
    });

    if (Object.keys(filters).length === 0) {
      this.prismaQuery.where = {};
    }

    if (this.prismaQuery.where.AND || this.prismaQuery.where.OR) {
    this.prismaQuery.where = {
      AND: [
        this.prismaQuery.where,
        filters,
      ],
    };
  } else {
    this.prismaQuery.where = {
      ...this.prismaQuery.where,
      ...filters,
    };
  }

    return this;
  }

  sort(defaultSort: string = "createdAt:desc"): IQueryBuilder<T> {
    return this;
  }

  paginate(): IQueryBuilder<T> {
    return this;
  }

  async exec(): Promise<T[]> {
    return this.model.findMany(this.prismaQuery);
  }
}
