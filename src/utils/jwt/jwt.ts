import { JwtPayload } from "./jwt.types";
import { getConfig } from "../../config";
import AppError from "../AppError";
import jwt from "jsonwebtoken";

export default class JWTUtils {
  public static generateAccessToken = (payload: JwtPayload) => {
    return jwt.sign(payload, getConfig.JWT_ACCESS_SECRET_KEY, {
      expiresIn: "15m",
    });
  };

  public static generateRefreshToken = (payload: JwtPayload) => {
    return jwt.sign(payload, getConfig.JWT_REFRESH_SECRET_KEY, {
      expiresIn: "7d",
    });
  };

  public static verifyAccessToken = async (token: string) => {
    try {
      const decoded = jwt.verify(token, getConfig.JWT_ACCESS_SECRET_KEY);

      return decoded as JwtPayload;
    } catch (error) {
      throw new AppError(401, "Invalid access token");
    }
  };

  public static verifyRefreshToken = async (token: string) => {
    try {
      const decoded = jwt.verify(token, getConfig.JWT_REFRESH_SECRET_KEY);

      return decoded as JwtPayload;
    } catch (error) {
      throw new AppError(401, "Invalid refresh token");
    }
  };
}
