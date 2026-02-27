/* eslint-disable @typescript-eslint/no-explicit-any */
import { prisma } from "../../lib/prisma";
import generateSlug from "../../services/generateSlug.service";
import AppError from "../../utils/AppError";
import AppResponse from "../../utils/AppResponse";
import { IGetCategoryParams } from "./category.types";
import {
  CreateCategoryInput,
  UpdateCategoryInput,
} from "./category.validation";

export default class CategoryService {
  public static getCategories = async (params: IGetCategoryParams) => {
    try {
      const {
        id,
        name,
        slug,
        parentId,
        level,
        isActive,

        includeChildren,
        includeParent,

        sortBy = "createdAt",
        sortOrder = "desc",

        page = 1,
        limit = 20,
      } = params;

      const where: any = {};

      if (id) {
        where.id = id;
      }

      if (slug) {
        where.slug = slug;
      }

      if (name) {
        where.name = {
          contains: name,
          mode: "insensitive",
        };
      }

      if (parentId !== undefined) {
        where.parentId = parentId;
      }

      if (level !== undefined) {
        where.level = level;
      }

      if (isActive !== undefined) {
        where.isActive = isActive;
      }

      const include: any = {};

      if (includeChildren) {
        include.children = {
          where: {
            isActive: true,
          },
          orderBy: {
            sortOrder: "asc",
          },
        };
      }

      if (includeParent) {
        include.parent = true;
      }

      const skip = (page - 1) * limit;
      const take = limit;

      const [data, total] = await Promise.all([
        prisma.category.findMany({
          where,
          include,
          orderBy: {
            [sortBy]: sortOrder,
          },
          skip,
          take,
        }),

        prisma.category.count({ where }),
      ]);

      return AppResponse.ok(
        {
          ...data,
          meta: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
          },
        },
        "Fetched category successfully",
      );
    } catch (error: any) {
      console.error("Get categories error", error);

      if (error instanceof AppError) {
        throw error;
      }

      if (error?.message) {
        throw AppError.badRequest(error?.message);
      }

      throw AppError.internal(
        "Failed to get categories ",
        error instanceof Error ? error : undefined,
      );
    }
  };

  public static createCategory = async (data: CreateCategoryInput) => {
    try {
      const result = await prisma.category.create({
        data: {
          ...data,
          slug: generateSlug(data.name),
        },
      });

      if (!result) {
        throw AppError.badRequest("Failed to create category");
      }

      return AppResponse.created(result, "Category created successfully");
    } catch (error: any) {
      console.error("Create category error", error);

      if (error instanceof AppError) {
        throw error;
      }

      if (error?.message) {
        throw AppError.badRequest(error?.message);
      }

      throw AppError.internal(
        "Failed to create category ",
        error instanceof Error ? error : undefined,
      );
    }
  };

  public static updateCategory = async (
    categoryId: string,
    data: UpdateCategoryInput,
  ) => {
    try {
      const result = await prisma.category.update({
        where: {
          id: categoryId,
        },
        data: {
          ...data,
        },
      });

      return AppResponse.ok(result, "Category updated successfully");
    } catch (error: any) {
      console.error("Update category error", error);

      if (error instanceof AppError) {
        throw error;
      }

      if (error?.message) {
        throw AppError.badRequest(error?.message);
      }

      throw AppError.internal(
        "Failed to update category ",
        error instanceof Error ? error : undefined,
      );
    }
  };

  public static deleteCategory = async (categoryId: string) => {
    try {
      const result = await prisma.category.delete({
        where: {
          id: categoryId,
        },
      });

      return AppResponse.ok(result, "Deleted category successfully");
    } catch (error: any) {
      console.error("Delete category error", error);

      if (error instanceof AppError) {
        throw error;
      }

      if (error?.message) {
        throw AppError.badRequest(error?.message);
      }

      throw AppError.internal(
        "Failed to delete category ",
        error instanceof Error ? error : undefined,
      );
    }
  };
}
