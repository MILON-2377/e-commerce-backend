import nodemailer from "nodemailer";
import { getConfig } from ".";

export const transporter = nodemailer.createTransport({
  host: getConfig.EMAIL_SENDER.EMAIL_SENDER_SMTP_HOST,
  secure: true,
  auth: {
    user: getConfig.EMAIL_SENDER.EMAIL_SENDER_SMTP_USER,
    pass: getConfig.EMAIL_SENDER.EMAIL_SENDER_SMTP_PASS,
  },
  port: Number(getConfig.EMAIL_SENDER.EMAIL_SENDER_SMTP_PORT),
});
