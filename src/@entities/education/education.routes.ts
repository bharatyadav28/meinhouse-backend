import express from "express";

import { getEducation, updateEducation } from "./education.controller";
import { isAdmin } from "../../middlewares/auth";
import { validateData } from "../../middlewares/validation";
import { createEducationSchema } from "./education.model";

const educationRouter = express.Router();

educationRouter
  .route("/")
  .put(isAdmin, validateData(createEducationSchema), updateEducation)
  .get(getEducation);

export default educationRouter;
