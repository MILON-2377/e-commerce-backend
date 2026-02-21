import fastify from "fastify";
import cookie from "@fastify/cookie";
import routes from "./routes";
import globalError from "./middleware/globalError";

export default function createApp() {
  const app = fastify({ logger: true });

  app.register(cookie);

  app.register(routes);


  app.setErrorHandler(globalError);

  return app;
}
