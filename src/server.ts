import { prisma } from "./lib/prisma";
import createApp from "./app";
import { transporter } from "./config/mail.config";

const app = createApp();

const start = async () => {
  try {
    await prisma.$connect();
    console.log("Database connection success");

    await transporter.verify((err, success) => {
      if (err) {
        console.error("SMTP ERROR", err);
      } else {
        console.log("SMTP READY", success);
      }
    });

    await app.listen({ port: 5000, host: "0.0.0.0" });
    console.log("Server is running on port: ", 5000);
  } catch (error) {
    console.error("Something went wrong", error);
    throw error;
  }
};

start();
