import { FastifyInstance } from "fastify";
import AuthController from "./auth.controller";
import Authentication from "../../middleware/authorization";

//  * fastify.get(
//   "/admin",
//   {
//     preHandler: [authenticate, authorize("ADMIN")],
//   },
//   async (req, reply) => {
//     return { message: "Welcome Admin" };
//   }
// );

export default function authRoutes(route: FastifyInstance) {
  route.post("/register", AuthController.register);
  route.post("/login", AuthController.loginUser);
  route.post(
    "/forgot-password",
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
}
