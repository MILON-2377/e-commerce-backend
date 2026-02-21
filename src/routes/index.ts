import { FastifyInstance } from "fastify";
import authRoutes from "../app/auth/auth.routes";

export default function routes(app: FastifyInstance) {
  app.register(authRoutes, { prefix: "/api/v1/auth" });

  // Authorization Role
  /**
   * fastify.get(
  "/admin",
  {
    preHandler: [authenticate, authorize("ADMIN")],
  },
  async (req, reply) => {
    return { message: "Welcome Admin" };
  }
);

   */

  app.get("/", async () => {
    return {
      status: "ok",
      message: "Welcome to the Better Auth System API",
    };
  });
}
