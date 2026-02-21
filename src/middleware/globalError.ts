import { FastifyError, FastifyReply, FastifyRequest } from "fastify";
import AppError from "../utils/AppError";
import sendError from "../utils/sendError";

export default function globalError(
  error: FastifyError | Error,
  _req: FastifyRequest,
  reply: FastifyReply,
) {
  // AppError (already normalized)
  if (error instanceof AppError) {
    return sendError(reply, error.statusCode, {
      message: error.message,
      code: error.code,
      details: error.details,
    });
  }

  // Validation errors
  if ("validation" in error && error.validation) {
    return sendError(reply, 422, {
      message: "Validation failed",
      code: "VALIDATION_ERROR",
      details: error.validation,
    });
  }

  // Prisma errors → convert to AppError
  if (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    typeof (error as any)?.code === "string" &&
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (error as any).code.startsWith("P")
  ) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const prismaCode = (error as any).code;

    return sendError(reply, 400, {
      message: "Database error",
      code: "DATABASE_ERROR",
      details: { prismaCode },
    });
  }

  // Unknown errors
  console.error("🔥 UNHANDLED ERROR:", error);

  return sendError(reply, 500, {
    message: "Internal Server Error",
    code: "INTERNAL_ERROR",
  });
}
