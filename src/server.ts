import dns from "dns";
dns.setDefaultResultOrder('ipv4first')

import { prisma } from "./lib/prisma";
import createApp from "./app";
import { transporter } from "./config/mail.config";
import cloudinary from "./config/cloudinary.config";

const app = createApp();

const start = async () => {
  try {
    await prisma.$connect();
    console.log("Database connection success");

    transporter.verify((err, success) => {
      if (err) {
        console.error("SMTP ERROR", err);
      } else {
        console.log("SMTP READY", success);
      }
    });

    const ping = await cloudinary.api.ping();
    console.log("Cloudinary connected", ping);

    await app.listen({ port: 5000, host: "0.0.0.0" });
    console.log("Server is running on port: ", 5000);
  } catch (error) {
    console.error("Something went wrong", error);
    throw error;
  }
};

start();
