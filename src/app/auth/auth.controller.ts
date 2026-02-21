import { FastifyReply, FastifyRequest } from "fastify";
import asyncHandler from "../../utils/asyncHandler";
import validationInput from "../../utils/validationInput";
import {
  LogInInput,
  LogInSchema,
  RegisterInput,
  RegisterSchema,
} from "./auth.validation";
import AuthService from "./auth.service";
import AppResponse from "../../utils/AppResponse";
import JWTUtils from "../../utils/jwt/jwt";
import CookieUtils from "../../utils/cookie/cookie";
import { getConfig } from "../../config";

export default class AuthController {
  public static register = asyncHandler(
    async (req: FastifyRequest, res: FastifyReply) => {
      validationInput(req, RegisterSchema);

      const data = req.body;

      const response = await AuthService.register(data as RegisterInput);

      const payload = {
        userId: response.user.id,
        email: response.user.email,
        role: response.role,
      };

      const accessToken = JWTUtils.generateAccessToken(payload);
      const refreshToken = JWTUtils.generateRefreshToken(payload);

      CookieUtils.setAccessTokenCookie(
        res,
        getConfig.ACCESS_TOKEN_COOKIE_NAME,
        accessToken,
      );
      CookieUtils.setRefreshTokenCookie(
        res,
        getConfig.REFRESH_TOKEN_COOKIE_NAME,
        refreshToken,
      );
      CookieUtils.setSessionTokenCookie(
        res,
        getConfig.SESSION_COOKIE_NAME,
        accessToken,
      );

      return res.status(201).send(AppResponse.created(response.user));
    },
  );

  public static loginUser = asyncHandler(
    async (req: FastifyRequest, res: FastifyReply) => {
      validationInput(req, LogInSchema);

      const body = req.body;

      const response = await AuthService.login(body as LogInInput);

      const payload = {
        userId: response.user.id,
        email: response.user.email,
        role: response.role,
      };

      const accessToken = JWTUtils.generateAccessToken(payload);
      const refreshToken = JWTUtils.generateRefreshToken(payload);

      CookieUtils.setAccessTokenCookie(
        res,
        getConfig.ACCESS_TOKEN_COOKIE_NAME,
        accessToken,
      );
      CookieUtils.setRefreshTokenCookie(
        res,
        getConfig.REFRESH_TOKEN_COOKIE_NAME,
        refreshToken,
      );
      CookieUtils.setSessionTokenCookie(
        res,
        getConfig.SESSION_COOKIE_NAME,
        accessToken,
      );

      return res.status(200).send(AppResponse.ok(response.user));
    },
  );
}
