import express, { Express } from "express";
import morgan from "morgan";
import swaggerUI from "swagger-ui-express";
import swaggerDoc from "../../swagger.json";
import routes from "../routes";
import errorHandlerMiddleware from "../middleware/ErrorHandlerMiddleware";
import corsMiddleware from "../middleware/CorsMiddleware";
import authVerifyMiddleware from "../middleware/AuthVerifyMiddleware";
import { API_ROUTES } from "../config/apiRoutes";
import { isDevEnv } from "../utils/EnvChecker";

export default function loadServer() {
  const app: Express = express();

  app.use(corsMiddleware);
  app.use(express.json());
  // app.use(authVerifyMiddleware);

  if (isDevEnv()) {
    app.use(morgan("tiny"));

    app.use(API_ROUTES.SERVICES.SWAGGER, swaggerUI.serve, swaggerUI.setup(swaggerDoc));
  }

  routes(app);

  app.use(errorHandlerMiddleware);

  return app;
}
