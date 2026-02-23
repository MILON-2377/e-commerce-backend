import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";

import { prisma } from "./prisma";
import { bearer, emailOTP } from "better-auth/plugins";
import EmailService from "../services/email.service";
import { getConfig } from "../config";
import AppError from "../utils/AppError";
import { UserRole } from "../../generated/prisma/enums";

export const auth = betterAuth({
  baseURL: getConfig.BETTER_AUTH_URL,
  secret: getConfig.BETTER_AUTH_SECRET,
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),

  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
  },

  emailVerification: {
    sendOnSignIn: true,
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
  },

  socialProviders: {
    google: {
      clientId: getConfig.GOOGLE_CREDENTIALS.GOOGLE_CLIENT_ID,
      clientSecret: getConfig.GOOGLE_CREDENTIALS.GOOGLE_CLIENT_SECRET,

      mapProfileToUser: () => ({
        role: UserRole.USER,
        emailVerified: true,
      }),
    },
  },

  plugins: [
    bearer(),
    emailOTP({
      overrideDefaultEmailVerification: true,
      async sendVerificationOTP({ email, otp, type }) {
        try {
          const user = await prisma.user.findUnique({
            where: { email },
          });

          if (!user) {
            throw AppError.notFound("User not found");
          }

          if (type === "email-verification") {
            if (user.emailVerified) return;

            await EmailService.sendEmail({
              to: email,
              subject: "Verify your email",
              templateName: "otp",
              templateData: {
                name: user.name,
                otp,
              },
            });

            return;
          }

          if (type === "forget-password") {
            await EmailService.sendEmail({
              to: email,
              subject: "Password Reset OTP",
              templateName: "otp",
              templateData: {
                name: user.name,
                otp,
              },
            });

            return;
          }
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
          console.log("email sending error", error);

          if (error instanceof AppError) {
            throw error;
          }

          if (error?.message) {
            throw AppError.badRequest(error.message);
          }

          throw AppError.internal("Failed to send email otp from better auth");
        }
      },
      expiresIn: 2 * 60,
      otpLength: 6,
    }),
  ],

  session: {
    expiresIn: 60 * 60 * 60 * 24,
    updateAge: 60 * 60 * 60 * 24,
    cookieCache: {
      enabled: true,
      maxAge: 60 * 60 * 60 * 24,
    },
  },

  advanced: {
    useSecureCookies: false,
    cookie: {
      state: {
        attributes: {
          sameSite: "none",
          secure: true,
          httpOnly: true,
          path: "/",
        },
        sessionToken: {
          attributes: {
            sameSite: "none",
            secure: true,
            httpOnly: true,
            path: "/",
          },
        },
      },
    },
  },

  // redirectURLs: {
  //   signIn: ""
  // }
});
