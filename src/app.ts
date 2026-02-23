import fastify from "fastify";
import cookie from "@fastify/cookie";
import routes from "./routes";
import globalError from "./middleware/globalError";
import view from "@fastify/view";
import path from "path";
import ejs from "ejs";

export default function createApp() {
  const app = fastify({ logger: true });

  app.register(cookie);

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
