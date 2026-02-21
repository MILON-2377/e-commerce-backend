export interface AppErrorOptions {
  statusCode?: number;
  code?: string;
  details?: unknown;
  cause?: Error;
  isOperational?: boolean;
}

export default class AppError extends Error {
  public readonly statusCode: number;
  public readonly code?: string;
  public readonly details?: unknown;
  public readonly isOperational: boolean;

  constructor(
    message: string,
    {
      statusCode = 500,
      code,
      details,
      cause,
      isOperational = true,
    }: AppErrorOptions = {},
  ) {
    super(message, { cause });

    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
    this.isOperational = isOperational;

    Error.captureStackTrace(this, this.constructor);
  }

  /* =========================
   * Static factory helpers
   * ========================= */

  static notFound(
    message = "Resource not found",
    details?: unknown,
  ) {
    return new AppError(message, {
      statusCode: 404,
      code: "NOT_FOUND",
      details,
    });
  }

  static badRequest(
    message = "Bad request",
    details?: unknown,
  ) {
    return new AppError(message, {
      statusCode: 400,
      code: "BAD_REQUEST",
      details,
    });
  }

  static unauthorized(message = "Unauthorized") {
    return new AppError(message, {
      statusCode: 401,
      code: "UNAUTHORIZED",
    });
  }

  static forbidden(message = "Forbidden") {
    return new AppError(message, {
      statusCode: 403,
      code: "FORBIDDEN",
    });
  }

  static conflict(
    message = "Conflict",
    details?: unknown,
  ) {
    return new AppError(message, {
      statusCode: 409,
      code: "CONFLICT",
      details,
    });
  }

  static internal(
    message = "Internal server error",
    cause?: Error,
  ) {
    return new AppError(message, {
      statusCode: 500,
      code: "INTERNAL_ERROR",
      cause,
      isOperational: false,
    });
  }
}
