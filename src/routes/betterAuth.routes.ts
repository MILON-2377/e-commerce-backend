import { FastifyInstance } from "fastify";
import { auth } from "../lib/auth";

export default async function betterAuthRoutes(app: FastifyInstance) {
  app.route({
    method: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    url: "/*",
    handler: async (request, reply) => {
      const isGetLike = request.method === "GET" || request.method === "HEAD";

      const webRequest = new Request(
        `${request.protocol}://${request.headers.host}${request.url}`,
        {
          method: request.method,
          headers: request.headers as HeadersInit,
          body: isGetLike
            ? undefined
            : typeof request.body === "string"
              ? request.body
              : JSON.stringify(request.body ?? {}),
        },
      );

      const response = await auth.handler(webRequest);

      reply.status(response.status);

      response.headers.forEach((value, key) => {
        reply.header(key, value);
      });

      const responseBody = await response.text();
      reply.send(responseBody);
    },
  });
}
