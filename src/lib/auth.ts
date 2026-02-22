import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";

import { prisma } from "./prisma";
import { bearer, emailOTP } from "better-auth/plugins";
import EmailService from "../services/email.service";

export const auth = betterAuth({
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

  plugins: [
    bearer(),
    emailOTP({
  overrideDefaultEmailVerification: true,
  async sendVerificationOTP({ email, otp, type }) {
    try {
      if (type !== "email-verification") return;
  
      const user = await prisma.user.findUnique({
        where: { email },
      });
  
      if (!user || user.emailVerified) return;
  
      await EmailService.sendEmail({
        to: email,
        subject: "Verify your email",
        templateName: "otp",
        templateData: {
          name: user.name,
          otp,
        },
      });
    } catch (error) {
      console.log("email sending error", error);
      throw error;
    }
  },
  expiresIn: 2 * 60,
  otpLength: 6,
}),
  ],
});
