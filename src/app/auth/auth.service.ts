import { auth } from "../../lib/auth";
import { prisma } from "../../lib/prisma";
import AppError from "../../utils/AppError";
import { LogInInput, RegisterInput } from "./auth.validation";

export default class AuthService {
  public static register = async (data: RegisterInput) => {
    try {
      const { email, name, password } = data;

      const result = await auth.api.signUpEmail({
        body: {
          email,
          password,
          name,
        },
      });

      if (!result.user) {
        throw AppError.badRequest("Failed to register user");
      }

      const user = await prisma.user.findUnique({
        where: {
          id: result.user.id,
        },
        select: {
          role: true,
        },
      });

      if (!user) {
        throw AppError.badRequest("User not found after registration");
      }

      return { ...result, role: user.role };
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }

      throw AppError.internal(
        "Failed to register user",
        error instanceof Error ? error : undefined,
      );
    }
  };

  public static login = async (data: LogInInput) => {
    try {
      const { email, password } = data;

      const result = await auth.api.signInEmail({
        body: {
          email,
          password,
        },
      });

      if (!result.user) {
        throw AppError.badRequest("Failed to login user");
      }

      const user = await prisma.user.findUnique({
        where: {
          id: result.user.id,
        },
        select: {
          role: true,
        },
      });

      if (!user) {
        throw AppError.badRequest("User not found after login");
      }

      return { ...result, role: user.role };
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }

      throw AppError.internal(
        "Failed to login user",
        error instanceof Error ? error : undefined,
      );
    }
  };
}
