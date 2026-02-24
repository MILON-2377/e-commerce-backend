import fastify from "fastify";
import cookie from "@fastify/cookie";
import routes from "./routes";
import globalError from "./middleware/globalError";
import view from "@fastify/view";
import path from "path";
import ejs from "ejs";
import cors from "@fastify/cors";
import { getConfig } from "./config";
import AppError from "./utils/AppError";
import multipart from "@fastify/multipart";

export default function createApp() {
  const app = fastify({ logger: true });

  app.register(cors, {
    origin: (origin, cb) => {
      const allowedOrigins = [getConfig.FORNTEND_URL, "http://localhost:3000"];

      if (!origin) return cb(null, true);

      if (allowedOrigins.includes(origin)) {
        cb(null, true);
      } else {
        cb(AppError.badRequest("Not allowed by CORS"), false);
      }
    },

    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  });

  app.register(cookie);

  app.register(multipart, {
    limits: {
      fileSize: 5 * 1024 * 1024,
    },
  });

  app.register(view, {
    engine: {
      ejs: ejs,
    },
    root: path.join(process.cwd(), "src", "templates"),
  });

  app.register(routes);

  app.setErrorHandler(globalError);

  return app;
}
