import { Router } from "express";
import { API_ROUTES } from "../config/apiRoutes";
import { PromptController } from "../controllers/openai";

export default () => {
  const route = Router();

  route.post("/prompt", PromptController);

  return route;
};
