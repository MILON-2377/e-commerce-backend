import { FastifyReply, FastifyRequest } from "fastify";
import asyncHandler from "../../utils/asyncHandler";
import validationInput from "../../utils/validationInput";
import {
  LogInInput,
  LogInSchema,
  PasswordChangedSchema,
  PasswordChangeInput,
  RegisterInput,
  RegisterSchema,
  VerifyEmailInput,
  VerifyEmailSchema,
} from "./auth.validation";
import AuthService from "./auth.service";
import AppResponse from "../../utils/AppResponse";
import JWTUtils from "../../utils/jwt/jwt";
import CookieUtils from "../../utils/cookie/cookie";
import { getConfig } from "../../config";
import AppError from "../../utils/AppError";

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
        response.token as string,
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
        response.token,
      );

      return res
        .status(200)
        .send(AppResponse.ok(response.user, "Login successfully"));
    },
  );

  public static changePassword = asyncHandler(
    async (req: FastifyRequest, res: FastifyReply) => {
      validationInput(req, PasswordChangedSchema);

      const body = req.body;

      const betterAuthSessionToken = req.cookies[getConfig.SESSION_COOKIE_NAME];

      const response = await AuthService.changePassword(
        body as PasswordChangeInput,
        betterAuthSessionToken as string,
      );

      return res
        .status(200)
        .send(AppResponse.ok(response.user, "Password changed successfully"));
    },
  );

  public static refreshToken = asyncHandler(
    async (req: FastifyRequest, res: FastifyReply) => {
      const user = req.user;

      if (!user) {
        throw AppError.unauthorized("Unauthorized");
      }

      const oldRefreshToken = req.cookies[getConfig.REFRESH_TOKEN_COOKIE_NAME];
      const oldSessionToken = req.cookies[getConfig.SESSION_COOKIE_NAME];

      const { newAccessToken, newRefreshToken, newSessionToken } =
        await AuthService.refreshTokens(
          oldRefreshToken as string,
          oldSessionToken as string,
        );

      CookieUtils.setAccessTokenCookie(
        res,
        getConfig.ACCESS_TOKEN_COOKIE_NAME,
        newAccessToken,
      );
      CookieUtils.setRefreshTokenCookie(
        res,
        getConfig.REFRESH_TOKEN_COOKIE_NAME,
        newRefreshToken,
      );
      CookieUtils.setSessionTokenCookie(
        res,
        getConfig.SESSION_COOKIE_NAME,
        newSessionToken,
      );

      return res.status(200).send(
        AppResponse.ok(
          {
            accessToken: newAccessToken,
            refreshToken: newRefreshToken,
            sessionToken: newSessionToken,
          },
          "Refresh token rotate successfulyy",
        ),
      );
    },
  );

  public static verifyEmail = asyncHandler(
    async (req: FastifyRequest, res: FastifyReply) => {
      validationInput(req, VerifyEmailSchema);

      const { email, otp } = req.body as VerifyEmailInput;

      await AuthService.verifyEmail(email, otp);

      return res
        .status(200)
        .send(AppResponse.ok(null, "Email verification success"));
    },
  );
}
