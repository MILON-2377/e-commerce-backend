import dotenv from "dotenv";
import AppError from "../utils/AppError";

dotenv.config();

interface IConfig {
  DATABASE_URL: string;
  JWT_ACCESS_SECRET_KEY: string;
  JWT_REFRESH_SECRET_KEY: string;
  NODE_ENV: string;
  ACCESS_TOKEN_COOKIE_NAME: string;
  REFRESH_TOKEN_COOKIE_NAME: string;
  SESSION_COOKIE_NAME: string;
}

const loadEnvVariables = (): IConfig => {
  const configArray = [
    "DATABASE_URL",
    "JWT_ACCESS_SECRET_KEY",
    "JWT_REFRESH_SECRET_KEY",
    "NODE_ENV",
    "ACCESS_TOKEN_COOKIE_NAME",
    "REFRESH_TOKEN_COOKIE_NAME",
    "SESSION_COOKIE_NAME",
  ];

  configArray.forEach((key) => {
    if (!process.env[key]) {
      throw new AppError(
        500,
        `Missing environment variable: ${key}`,
        "CONFIG_ERROR",
        true,
      );
    }
  });

  return {
    DATABASE_URL: process.env.DATABASE_URL as string,
    JWT_ACCESS_SECRET_KEY: process.env.JWT_ACCESS_SECRET_KEY as string,
    JWT_REFRESH_SECRET_KEY: process.env.JWT_REFRESH_SECRET_KEY as string,
    NODE_ENV: process.env.NODE_ENV as string,
    ACCESS_TOKEN_COOKIE_NAME: process.env.ACCESS_TOKEN_COOKIE_NAME as string,
    SESSION_COOKIE_NAME: process.env.SESSION_COOKIE_NAME as string,
    REFRESH_TOKEN_COOKIE_NAME: process.env.REFRESH_TOKEN_COOKIE_NAME as string,
  };
};

export const getConfig = loadEnvVariables();
