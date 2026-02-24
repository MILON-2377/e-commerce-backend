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
  EMAIL_SENDER: {
    EMAIL_SENDER_SMTP_USER: string;
    EMAIL_SENDER_SMTP_PASS: string;
    EMAIL_SENDER_SMTP_HOST: string;
    EMAIL_SENDER_SMTP_PORT: string;
    EMAIL_SENDER_SMTP_FROM: string;
  };
  GOOGLE_CREDENTIALS: {
    GOOGLE_CLIENT_ID: string;
    GOOGLE_CLIENT_SECRET: string;
    GOOGLE_CALLBACK_URL: string;
  };
  BETTER_AUTH_URL: string;
  BETTER_AUTH_SECRET: string;
  FORNTEND_URL: string;
  CLOUDINARY: {
    API_KEY: string;
    API_SECRET: string;
    CLOUDINARY_NAME: string;
  };
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
    "EMAIL_SENDER_SMTP_USER",
    "EMAIL_SENDER_SMTP_PASS",
    "EMAIL_SENDER_SMTP_HOST",
    "EMAIL_SENDER_SMTP_PORT",
    "EMAIL_SENDER_SMTP_FROM",
    "GOOGLE_CLIENT_ID",
    "GOOGLE_CLIENT_SECRET",
    "GOOGLE_CALLBACK_URL",
    "BETTER_AUTH_URL",
    "BETTER_AUTH_SECRET",
    "FORNTEND_URL",
    "CLOUDINARY_API_SECRET",
    "CLOUDINARY_API_KEY",
    "CLOUDINARY_CLOUD_NAME",
  ];

  configArray.forEach((key) => {
    if (!process.env[key]) {
      throw AppError.internal(`Missing environment variable: ${key}`);
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
    EMAIL_SENDER: {
      EMAIL_SENDER_SMTP_USER: process.env.EMAIL_SENDER_SMTP_USER as string,
      EMAIL_SENDER_SMTP_PASS: process.env.EMAIL_SENDER_SMTP_PASS as string,
      EMAIL_SENDER_SMTP_HOST: process.env.EMAIL_SENDER_SMTP_HOST as string,
      EMAIL_SENDER_SMTP_PORT: process.env.EMAIL_SENDER_SMTP_PORT as string,
      EMAIL_SENDER_SMTP_FROM: process.env.EMAIL_SENDER_SMTP_FROM as string,
    },
    GOOGLE_CREDENTIALS: {
      GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID as string,
      GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET as string,
      GOOGLE_CALLBACK_URL: process.env.GOOGLE_CALLBACK_URL as string,
    },
    BETTER_AUTH_URL: process.env.BETTER_AUTH_URL as string,
    BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET as string,
    FORNTEND_URL: process.env.FORNTEND_URL as string,
    CLOUDINARY: {
      API_KEY: process.env.CLOUDINARY_API_KEY as string,
      API_SECRET: process.env.CLOUDINARY_API_SECRET as string,
      CLOUDINARY_NAME: process.env.CLOUDINARY_CLOUD_NAME as string,
    },
  };
};

export const getConfig = loadEnvVariables();
