import express from "express";
import {
  requestPasswordReset,
  resetPassword,
  validateResetToken,
} from "./auth_token.controller";

const tokenRouter = express.Router();

tokenRouter.route("/password-reset/req").post(requestPasswordReset);

tokenRouter.route("/reset-password").post(resetPassword);

tokenRouter.route("/password-reset/validate").post(validateResetToken);

export default tokenRouter;
