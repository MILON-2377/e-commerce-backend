import { FastifyInstance } from "fastify";
import AuthController from "./auth.controller";

export default function authRoutes(route: FastifyInstance) {
  route.post("/register", AuthController.register);
  route.post("/login", AuthController.loginUser);
}
