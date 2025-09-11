import express from "express";
import { validateData } from "../../middlewares/validation";
import { createUserSchema } from "../user";
import {
  logoutProfessional,
  deleteProfessionalAccount,
  changeProfessionalPassword,
  signinProfessional,
  signupProfessional,
} from "./professional.controller";
import { isProfessional } from "../../middlewares/auth";

const professionalRouter = express.Router();

professionalRouter.post(
  "/signup",
  validateData(createUserSchema),
  signupProfessional
);
professionalRouter.post("/signin", signinProfessional);
professionalRouter.delete("/logout", isProfessional, logoutProfessional);

professionalRouter.put(
  "/change-password",
  isProfessional,
  changeProfessionalPassword
);
professionalRouter.delete(
  "/delete-account",
  isProfessional,
  deleteProfessionalAccount
);

export default professionalRouter;
