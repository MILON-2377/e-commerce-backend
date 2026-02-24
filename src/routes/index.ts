import { FastifyInstance } from "fastify";
import authRoutes from "../app/auth/auth.routes";
import betterAuthRoutes from "./betterAuth.routes";
import uploadRoutes from "../app/upload/upload.routes";

export default function routes(app: FastifyInstance) {
  app.register(betterAuthRoutes, { prefix: "/api/auth" });

  app.register(authRoutes, { prefix: "/api/v1/auth" });

  app.register(uploadRoutes, { prefix: "/api/v1/uploads" });

  app.get("/", async () => {
    return {
      status: "ok",
      message: "Welcome to the Better Auth System API",
    };
  });
}
