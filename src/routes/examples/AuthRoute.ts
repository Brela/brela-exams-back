import { Router } from "express";
import { API_ROUTES } from "../../config/apiRoutes";
import {
  AdminRegistrationController,
  ChangePasswordController,
  LoginController,
  RegistrationController,
  ResetPasswordController,
  UpdateTokensController,
} from "../../controllers/examples/auth";

export default () => {
  const route = Router();

  route.post(API_ROUTES.AUTH.REGISTER_ADMIN, AdminRegistrationController);
  route.post(API_ROUTES.AUTH.CHANGE_PASSWORD, ChangePasswordController);
  route.post(API_ROUTES.AUTH.LOGIN, LoginController);
  route.post(API_ROUTES.AUTH.REGISTER, RegistrationController);
  route.put(API_ROUTES.AUTH.RESET_PASSWORD, ResetPasswordController);
  route.post(API_ROUTES.AUTH.REFRESH_TOKEN, UpdateTokensController);

  return route;
};
