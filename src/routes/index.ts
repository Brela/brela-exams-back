import { Express } from "express";
import authRoute from "./examples/AuthRoute";
// import oneTimeLinksRoute from "./OneTimeLinksRoute";
import postsRoute from "./examples/PostsRoute";
import usersRoute from "./examples/UsersRoute";
import { TEXT } from "../utils/JoiErrors";
import OpenAiRoute from "./OpenAiRoute";

export default (app: Express) => {
  app.use(authRoute());
  // app.use(oneTimeLinksRoute());
  app.use(postsRoute());
  app.use(usersRoute());
  app.use(OpenAiRoute());

  // This is default in case of unmatched routes
  app.use(function (req, res) {
    res.status(405).json({
      error: TEXT.ERRORS.methodNotAllowed,
    });
  });
};
