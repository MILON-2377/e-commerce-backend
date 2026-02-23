import { FastifyReply } from "fastify";
import { getConfig } from "../../config";

const isProd = getConfig.NODE_ENV === "production";

const baseCookieOptions = {
  httpOnly: true,
  secure: isProd,
  sameSite: isProd ? ("none" as const) : ("lax" as const),
  path: "/",
};

export default class CookieUtils {
  public static setAccessTokenCookie(res: FastifyReply, value: string) {
    res.setCookie(getConfig.ACCESS_TOKEN_COOKIE_NAME, value, {
      ...baseCookieOptions,
      maxAge: 60 * 60 * 24,
    });
  }

  public static setRefreshTokenCookie(res: FastifyReply, value: string) {
    res.setCookie(getConfig.REFRESH_TOKEN_COOKIE_NAME, value, {
      ...baseCookieOptions,
      maxAge: 60 * 60 * 24 * 7,
    });
  }

  public static setSessionTokenCookie(res: FastifyReply, value: string) {
    res.setCookie(getConfig.SESSION_COOKIE_NAME, value, {
      ...baseCookieOptions,
      maxAge: 60 * 60 * 24,
    });
  }

  public static clearCookie(res: FastifyReply, key: string) {
    res.clearCookie(key, {
      ...baseCookieOptions,
    });
  }
}
