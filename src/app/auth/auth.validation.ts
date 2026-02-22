import z from "zod";

export const RegisterSchema = z.object({
  email: z.email(),
  name: z.string().min(2, "Name must be at least 2 characters long"),
  password: z.string().min(8, "Password must be at least 8 characters long"),
});

export const LogInSchema = z.object({
  email: z.email(),
  password: z.string().min(8, "Password must be at least 8 character"),
});

export const PasswordChangedSchema = z.object({
  currentPassword: z.string().min(8, "Password must be at least 8 characters"),
  newPassword: z.string().min(8, "Password at least 8 characters long"),
});

export const VerifyEmailSchema = z.object({
  email: z.email(),
  otp: z.string(),
});

export type RegisterInput = z.infer<typeof RegisterSchema>;
export type LogInInput = z.infer<typeof LogInSchema>;
export type PasswordChangeInput = z.infer<typeof PasswordChangedSchema>;
export type VerifyEmailInput = z.infer<typeof VerifyEmailSchema>;
