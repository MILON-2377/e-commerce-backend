import { FastifyReply, FastifyRequest } from "fastify";

export default function asyncHandler(
  fn: (req: FastifyRequest, res: FastifyReply) => Promise<any>,
) {
  return async (req: FastifyRequest, res: FastifyReply) => {
    try {
      await fn(req, res);
    } catch (err: any) {
      res.status(err.statusCode || 500).send({
        error: err.message || "Internal Server Error",
      });
    }
  };
}
