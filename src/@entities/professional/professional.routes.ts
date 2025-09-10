import express from "express";
import { validateData } from "../../middlewares/validation";
import { createUserSchema } from "../user";
import {
  signinProfessional,
  signupProfessional,
} from "./professional.controller";

const professionalRouter = express.Router();

professionalRouter.post(
  "/signup",
  validateData(createUserSchema),
  signupProfessional
);
professionalRouter.post("/signin", signinProfessional);

export default professionalRouter;
