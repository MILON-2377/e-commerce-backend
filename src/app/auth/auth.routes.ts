import { FastifyInstance } from "fastify";
import AuthController from "./auth.controller";
import Authentication from "../../middleware/authorization";

export default function authRoutes(route: FastifyInstance) {
  route.post("/register", AuthController.register);
  route.post("/login", AuthController.loginUser);
  route.post(
    "/change-password",
    {
      preHandler: [
        Authentication.authenticate,
        Authentication.authorize("ADMIN", "USER"),
      ],
    },
    AuthController.changePassword,
  );

  route.get(
    "/rotate-refresh-token",
    {
      preHandler: [
        Authentication.authenticate,
        Authentication.authorize("ADMIN", "USER"),
      ],
    },
    AuthController.refreshToken,
  );

  route.post(
    "/verify-email",
    {
      preHandler: [
        Authentication.authenticate,
        Authentication.authorize("ADMIN", "USER"),
      ],
    },
    AuthController.verifyEmail,
  );

  route.post("/forget-password", AuthController.forgetPassword);

  route.post("/reset-password", AuthController.resetPassword);

  route.get("/login/google", AuthController.googleLogin);
  route.get("/login/google/success", AuthController.googleLoginSuccess);
}
