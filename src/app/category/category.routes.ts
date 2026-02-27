import { FastifyInstance } from "fastify";
import CategoryController from "./category.controller";
import {
  CreateCategorySchema,
  UpdateCategorySchema,
} from "./category.validation";
import validateInput from "../../utils/validationInput";

export default async function categoryRoutes(route: FastifyInstance) {
  route.get("/", CategoryController.getCategories);

  route.post(
    "/",
    { preHandler: [validateInput(CreateCategorySchema)] },
    CategoryController.createCategory,
  );

  route.put(
    "/:categoryId",
    { preHandler: [validateInput(UpdateCategorySchema)] },
    CategoryController.updateCategory,
  );
}
