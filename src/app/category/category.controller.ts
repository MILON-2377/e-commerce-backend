import { FastifyReply, FastifyRequest } from "fastify";
import asyncHandler from "../../utils/asyncHandler";
import CategoryService from "./category.service";
import {
  CreateCategoryInput,
  UpdateCategoryInput,
} from "./category.validation";
import { IGetCategoryParams } from "./category.types";

export default class CategoryController {
  public static getCategories = asyncHandler(
    async (req: FastifyRequest, res: FastifyReply) => {
      const query = req.query as IGetCategoryParams;

      const response = await CategoryService.getCategories(query);

      return res.status(response.statusCode).send(response);
    },
  );

  public static createCategory = asyncHandler(
    async (req: FastifyRequest, reply: FastifyReply) => {
      const body = req.body as CreateCategoryInput;

      const response = await CategoryService.createCategory(body);

      return reply.status(201).send(response);
    },
  );

  public static updateCategory = asyncHandler(
    async (req: FastifyRequest, reply: FastifyReply) => {
      const { categoryId } = req.params as { categoryId: string };

      const body = req.body as UpdateCategoryInput;

      const response = await CategoryService.updateCategory(categoryId, body);

      return reply.status(200).send(response);
    },
  );
}
