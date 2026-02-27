/* eslint-disable @typescript-eslint/no-explicit-any */
import { FastifyError, FastifyReply, FastifyRequest } from "fastify";
import AppError from "../utils/AppError";
import sendError from "../utils/sendError";

export default function globalError(
  error: FastifyError | Error,
  _req: FastifyRequest,
  reply: FastifyReply,
) {
  // ✅ Handle AppError
  if (error instanceof AppError) {
    return sendError(reply, error.statusCode, {
      message: error.message,
      code: error.code,
      details: error.details,
    });
  }

  // ✅ Handle Zod or validation errors
  if ("validation" in error && error.validation) {
    return sendError(reply, 422, {
      message: "Validation failed",
      code: "VALIDATION_ERROR",
      details: error.validation,
    });
  }

  // ✅ Handle Prisma errors
  // Prisma errors have `code` like 'P2002', 'P2025', etc.
  if (
    "code" in error &&
    typeof (error as any).code === "string" &&
    (error as any).code.startsWith("P")
  ) {
    const prismaError = error as any;
    let message = "Database error";

    // Optional: customize messages for common Prisma errors
    switch (prismaError.code) {
      case "P2002":
        message = "Unique constraint failed";
        break;
      case "P2025":
        message = "Record not found";
        break;
      default:
        message = prismaError.message || "Database error";
    }

    return sendError(reply, 400, {
      message,
      code: "DATABASE_ERROR",
      details: { prismaCode: prismaError.code, meta: prismaError.meta || null },
    });
  }

  // ✅ Fallback for unknown errors
  console.error("🔥 UNHANDLED ERROR:", error);

  return sendError(reply, 500, {
    message: "Internal Server Error",
    code: "INTERNAL_ERROR",
  });
}
