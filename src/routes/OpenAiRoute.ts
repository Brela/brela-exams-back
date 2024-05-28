import { Router } from "express";
import { API_ROUTES } from "../config/apiRoutes";
import { PromptController } from "../controllers/openai";

export default () => {
  const route = Router();

  route.post(API_ROUTES.OPENAI.PROMPT, PromptController);

  return route;
};
