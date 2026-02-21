import { ZodError, ZodSchema } from "zod";
import AppError from "./AppError";
import { FastifyRequest } from "fastify";

export default function validationInput<T>(
  req: FastifyRequest,
  schema: ZodSchema<T>,
) {
  try {
    const data = req.body;

    const validatedData = schema.parse(data);

    req.body = validatedData;
  } catch (err) {
    if (err instanceof ZodError) {
      throw new AppError(422, "Validation failed", "VALIDATION_ERROR", true);
    }

    throw new AppError(500, "Unknown validation error", false);
  }
}
