import { FastifyRequest } from "fastify";
import { getConfig } from "../config";
import AppError from "../utils/AppError";
import JWTUtils from "../utils/jwt/jwt";
import { UserRole } from "../../generated/prisma/enums";

export default class Authentication {
  static authenticate = async (req: FastifyRequest) => {
    const token = req.cookies[getConfig.ACCESS_TOKEN_COOKIE_NAME];

    if (!token) {
      throw AppError.unauthorized();
    }

    const decoded = await JWTUtils.verifyAccessToken(token);

    if (!decoded) {
      throw AppError.unauthorized("Invalid or expired token");
    }

    req.user = decoded;
  };

  static authorize = (...allowedRoles: UserRole[]) => {
    return async (req: FastifyRequest) => {
      if (!req.user) {
        throw AppError.unauthorized();
      }

      if (!allowedRoles.includes(req.user.role)) {
        throw AppError.forbidden();
      }
    };
  };
}
