import express from "express";

import {
  addNewPage,
  getAllPages,
  updatePage,
  getTermsAndConditionsPage,
  getPrivacyPolicy,
  getAboutUs,
} from "./pages.controller";
import { isAdmin } from "../../middlewares/auth";
import { validateData } from "../../middlewares/validation";
import { createPagesSchema, updatePagesSchema } from "./pages.model";

const pagesRouter = express.Router();

pagesRouter
  .route("/")
  .post(isAdmin, validateData(createPagesSchema), addNewPage)
  .get(isAdmin, getAllPages);

pagesRouter
  .route("/:id")
  .put(isAdmin, validateData(updatePagesSchema), updatePage);

pagesRouter.route("/terms-and-conditions").get(getTermsAndConditionsPage);
pagesRouter.route("/privacy-policy").get(getPrivacyPolicy);
pagesRouter.route("/about-us").get(getAboutUs);

export default pagesRouter;
