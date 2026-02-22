import AppError from "../utils/AppError";
import path from "path";
import ejs from "ejs";
import { transporter } from "../config/mail.config";
import { getConfig } from "../config";

interface ISendEmailOptions {
  to: string;
  subject: string;
  templateName: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  templateData: Record<string, any>;
  attachments?: {
    filename: string;
    content: Buffer | string;
    contentType: string;
  }[];
}

export default class EmailService {
  public static sendEmail = async ({
    subject,
    templateData,
    templateName,
    to,
    attachments,
  }: ISendEmailOptions) => {
    try {
      const templatePath = path.join(
        process.cwd(),
        "src",
        "templates",
        `${templateName}.ejs`,
      );
      const html = await ejs.renderFile(templatePath, templateData);

      const info = await transporter.sendMail({
        from: getConfig.EMAIL_SENDER.EMAIL_SENDER_SMTP_FROM,
        to,
        subject,
        html,
        attachments: attachments?.map((attachment) => ({
          filename: attachment.filename,
          content: attachment.content,
          contentType: attachment.contentType,
        })),
      });

      console.log(`Email send to ${to} : ${info.messageId}`);
    } catch (error) {
      console.error("email sending error from email service: ", error);

      if (error instanceof AppError) {
        throw error;
      }

      throw AppError.internal("Email sending error");
    }
  };
}
