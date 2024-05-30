import { Express } from "express";
import { TEXT } from "../utils/JoiErrors";
import OpenAiRoutes from "./OpenAiRoutes";

export default (app: Express) => {
  // app.use(authRoute());
  // app.use(oneTimeLinksRoute());
  // app.use(postsRoute());
  // app.use(usersRoute());
  app.use("/openai", OpenAiRoutes());

  // This is default in case of unmatched routes
  app.use(function (req, res) {
    res.status(405).json({
      error: TEXT.ERRORS.unmatchedRoutes,
    });
  });
};
