/* eslint-disable @typescript-eslint/no-explicit-any */
import { auth } from "../../lib/auth";
import { prisma } from "../../lib/prisma";
import AppError from "../../utils/AppError";
import JWTUtils from "../../utils/jwt/jwt";
import {
  LogInInput,
  PasswordChangeInput,
  RegisterInput,
  ResetPasswordInput,
} from "./auth.validation";

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
    } catch (error: any) {
      if (error instanceof AppError) {
        throw error;
      }

      if (error?.message) {
        throw AppError.badRequest(error.message);
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
    } catch (error: any) {
      if (error instanceof AppError) {
        throw error;
      }

      if (error?.message) {
        throw AppError.badRequest(error.message);
      }

      throw AppError.internal(
        "Failed to login user",
        error instanceof Error ? error : undefined,
      );
    }
  };

  public static changePassword = async (
    data: PasswordChangeInput,
    sessionToken: string,
  ) => {
    try {
      const { currentPassword, newPassword } = data;

      const session = await auth.api.getSession({
        headers: new Headers({
          Authorization: `Bearer ${sessionToken}`,
        }),
      });

      if (!session) {
        throw AppError.badRequest("Invalid sessioin token");
      }

      const result = await auth.api.changePassword({
        body: {
          currentPassword,
          newPassword,
          revokeOtherSessions: true,
        },
        headers: new Headers({
          Authorization: `Bearer ${sessionToken}`,
        }),
      });

      console.log({ result });

      if (!result.user) {
        throw AppError.badRequest("Failed to change password");
      }

      return result;
    } catch (error: any) {
      if (error instanceof AppError) {
        throw error;
      }

      if (error instanceof Error) {
        throw AppError.badRequest(error.message);
      }

      if (error?.message) {
        throw AppError.badRequest(error.message);
      }

      throw AppError.internal(
        "Failed to change password",
        error instanceof Error ? error : undefined,
      );
    }
  };

  public static refreshTokens = async (
    refreshToken: string,
    sessionToken: string,
  ) => {
    try {
      const isSessionExist = await prisma.session.findUnique({
        where: {
          token: sessionToken,
        },
        include: {
          user: true,
        },
      });

      if (!isSessionExist) {
        throw AppError.unauthorized("Invalid session token or expired");
      }

      const decodedRefreshToken = JWTUtils.verifyRefreshToken(refreshToken);

      if (!decodedRefreshToken) {
        throw AppError.unauthorized("Invalid or expired refresh token");
      }

      const user = await prisma.user.findUnique({
        where: {
          id: (await decodedRefreshToken).userId,
        },
      });

      if (!user) {
        throw AppError.notFound("User not found");
      }

      const payload = {
        userId: user.id,
        email: user.email,
        role: user.role,
      };

      const newAccessToken = JWTUtils.generateAccessToken(payload);
      const newRefreshToken = JWTUtils.generateRefreshToken(payload);

      const updateSession = await prisma.session.update({
        where: {
          token: sessionToken,
        },
        data: {
          token: sessionToken,
          expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 7),
        },
      });

      return {
        newAccessToken,
        newRefreshToken,
        newSessionToken: updateSession.token,
      };
    } catch (error: any) {
      if (error instanceof AppError) {
        throw error;
      }

      if (error?.message) {
        throw AppError.badRequest(error.message);
      }

      throw AppError.unauthorized("Invalid or expired refresh token");
    }
  };

  public static verifyEmail = async (email: string, otp: string) => {
    try {
      const result = await auth.api.verifyEmailOTP({
        body: {
          email,
          otp,
        },
      });

      if (result.status && !result.user.emailVerified) {
        await prisma.user.update({
          where: {
            email,
          },
          data: {
            emailVerified: true,
          },
        });
      }
    } catch (error: any) {
      if (error instanceof AppError) {
        throw error;
      }

      if (error?.message) {
        throw AppError.badRequest(error.message);
      }

      throw AppError.internal(
        "Verify email error",
        error instanceof Error ? error : undefined,
      );
    }
  };

  public static forgetPassword = async (email: string) => {
    try {
      const user = await prisma.user.findUnique({
        where: {
          email,
        },
      });

      if (!user) {
        throw AppError.notFound("User not found");
      }

      if (!user.emailVerified) {
        throw AppError.badRequest("Email not verified");
      }

      const result = await auth.api.requestPasswordResetEmailOTP({
        body: {
          email,
        },
      });

      if (!result.success) {
        throw AppError.badRequest("Failed to reset password");
      }

      return result;
    } catch (error: any) {
      if (error instanceof AppError) {
        throw error;
      }

      if (error?.message) {
        throw AppError.badRequest(error.message);
      }

      throw AppError.internal("Failed to send reset password request ");
    }
  };

  public static resetPassword = async (payload: ResetPasswordInput) => {
    try {
      const { email, otp, newPassword } = payload;

      const user = await prisma.user.findUnique({
        where: {
          email,
        },
      });

      if (!user) {
        throw AppError.notFound("User not found");
      }

      if (!user.emailVerified) {
        throw AppError.badRequest("Email not verified");
      }

      await auth.api.resetPasswordEmailOTP({
        body: {
          email,
          otp,
          password: newPassword,
        },
      });

      await prisma.session.deleteMany({
        where: {
          userId: user.id,
        },
      });
    } catch (error: any) {
      console.error("reset password service error: ", error);

      if (error instanceof AppError) {
        throw error;
      }

      if (error?.message) {
        throw AppError.badRequest(error.message);
      }

      throw AppError.internal("Failed to reset password");
    }
  };

  public static googleSignUp = async () => {
    try {
      await auth.api.signInSocial();
    } catch (error: any) {
      if (error instanceof AppError) {
        throw error;
      }

      if (error?.message) {
        throw AppError.badRequest(error.message);
      }

      throw AppError.internal(
        "Failed to signup with google",
        error instanceof Error ? error : undefined,
      );
    }
  };

  public static googleLoginSuccess = async (userId: string) => {
    try {
      const result = await prisma.user.findUnique({
        where: {
          id: userId,
        },
      });

      return result;
    } catch (error: any) {
      if (error instanceof AppError) {
        throw error;
      }

      if (error?.message) {
        throw AppError.badRequest(error.message);
      }

      throw AppError.internal("Failed to google login");
    }
  };
}
