/* eslint-disable @typescript-eslint/no-explicit-any */
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
  ResetPasswordInput,
  ResetPasswordSchema,
  VerifyEmailInput,
  VerifyEmailSchema,
} from "./auth.validation";
import AuthService from "./auth.service";
import AppResponse from "../../utils/AppResponse";
import JWTUtils from "../../utils/jwt/jwt";
import CookieUtils from "../../utils/cookie/cookie";
import { getConfig } from "../../config";
import AppError from "../../utils/AppError";
import { auth } from "../../lib/auth";

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

      CookieUtils.setAccessTokenCookie(res, accessToken);
      CookieUtils.setRefreshTokenCookie(res, refreshToken);
      CookieUtils.setSessionTokenCookie(res, response.token as string);

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

      CookieUtils.setAccessTokenCookie(res, accessToken);
      CookieUtils.setRefreshTokenCookie(res, refreshToken);
      CookieUtils.setSessionTokenCookie(res, response.token as string);

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

      CookieUtils.setAccessTokenCookie(res, newAccessToken);
      CookieUtils.setRefreshTokenCookie(res, newRefreshToken);
      CookieUtils.setSessionTokenCookie(res, newSessionToken);

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

  public static forgetPassword = asyncHandler(
    async (req: FastifyRequest, res: FastifyReply) => {
      const { email }: { email: string } = req.body as any;

      await AuthService.forgetPassword(email);

      return res
        .status(200)
        .send(AppResponse.ok(null, "Forgot password req send successfully"));
    },
  );

  public static resetPassword = asyncHandler(
    async (req: FastifyRequest, res: FastifyReply) => {
      validationInput(req, ResetPasswordSchema);

      const body = req.body;

      await AuthService.resetPassword(body as ResetPasswordInput);

      return res
        .status(200)
        .send(AppResponse.ok(null, "Password reset successfully"));
    },
  );

  public static googleLogin = asyncHandler(
    async (req: FastifyRequest, reply: FastifyReply) => {
      const allowedRedirects = ["/dashboard", "/profile", "/"];

      const queryRedirect =
        (req.query as { redirect?: string }).redirect || "/dashboard";

      const redirectPath = allowedRedirects.includes(queryRedirect)
        ? queryRedirect
        : "/dashboard";

      const encodedRedirectPath = encodeURIComponent(redirectPath);

      return reply.view("googleRedirect.ejs", {
        callbackURL: `/api/v1/auth/login/google/success?redirect=${encodedRedirectPath}`,
        betterAuthUrl: getConfig.BETTER_AUTH_URL,
      });
    },
  );

  public static googleLoginSuccess = asyncHandler(
    async (req: FastifyRequest, res: FastifyReply) => {
      const redirectPath =
        (req.query as { redirect?: string }).redirect || "/dashboard";

      const allowedRedirects = ["/dashboard", "/profile", "/"];

      const safeRedirectPath = allowedRedirects.includes(redirectPath)
        ? redirectPath
        : "/dashboard";

      const session = await auth.api.getSession({
        headers: {
          cookie: req.headers.cookie || "",
        },
      });

      if (!session || !session.user) {
        return res.redirect(
          `${getConfig.FORNTEND_URL}/login?error=oAuth_failed`,
        );
      }

      const response = await AuthService.googleLoginSuccess(session.user.id);

      if (!response) {
        throw AppError.notFound("User not found");
      }

      const payload = {
        userId: response?.id,
        email: response.email,
        role: response.role,
      };

      //TODO: set up access, refresh, session token on cookie
      const accessToken = JWTUtils.generateAccessToken(payload);
      const refreshToken = JWTUtils.generateRefreshToken(payload);
      CookieUtils.setAccessTokenCookie(res, accessToken);
      CookieUtils.setRefreshTokenCookie(res, refreshToken);
      CookieUtils.setRefreshTokenCookie(
        res,
        req.cookies[getConfig.SESSION_COOKIE_NAME] as string,
      );

      // const isValidRedirectPath = redirectPath.startsWith("/")

      return res.redirect(`${getConfig.FORNTEND_URL}${safeRedirectPath}`);
    },
  );

  public static oAuthHandlerError = asyncHandler(
    async (req: FastifyRequest, res: FastifyReply) => {
      res.clearCookie?.("better-auth.session_token", {
        path: "/",
      });

      const error = (req.query as { error?: string }).error || "oauth_failed";

      return res.redirect(
        `
        ${getConfig.FORNTEND_URL}/login?error=${encodeURIComponent(error)}
        `,
      );
    },
  );
}
