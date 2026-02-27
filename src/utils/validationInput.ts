/* eslint-disable @typescript-eslint/no-explicit-any */
import { ZodError, ZodSchema } from "zod";
import AppError from "./AppError";
import { FastifyRequest } from "fastify";

function validationInput<T>(req: FastifyRequest, schema: ZodSchema<T>) {
  try {
    const data = req.body;
    const validatedData = schema.parse(data);

    req.body = validatedData;
  } catch (err: any) {
    if (err instanceof ZodError) {
      const errorMessage = err.issues
        .map((e) => `${e.path.join(".")}: ${e.message}`)
        .join("; ");

      throw AppError.custom(422, errorMessage, "VALIDATION_ERROR", err);
    }

    throw new AppError("Unknown validation error", {
      statusCode: 500,
      code: "INTERNAL_ERROR",
      cause: err instanceof Error ? err : undefined,
      isOperational: false,
    });
  }
}

export default function validateInput(schema: ZodSchema) {
  return async (req: FastifyRequest) => {
    validationInput(req, schema);
  };
}
