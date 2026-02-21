import { FastifyReply } from "fastify";

export interface ErrorResponse {
  success: false;
  message: string;
  code?: string;
  details?: unknown;
}

export default function sendError(
  reply: FastifyReply,
  statusCode: number,
  payload: Omit<ErrorResponse, "success">,
) {
  return reply.status(statusCode).send({
    success: false,
    ...payload,
  });
}
