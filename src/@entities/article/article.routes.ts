import express from "express";

import {
  createArticle,
  getArticles,
  updateArticle,
  deleteArticle,
  getArticleDetails,
} from "./article.controller";
import { createArticleSchema } from "./article.model";
import { validateData } from "../../middlewares/validation";
import { isAdmin } from "../../middlewares/auth";

const articleRouter = express.Router();

articleRouter
  .route("/")
  .post(isAdmin, validateData(createArticleSchema), createArticle)
  .get(getArticles);

articleRouter
  .route("/:id")
  .put(isAdmin, validateData(createArticleSchema), updateArticle)
  .delete(isAdmin, deleteArticle)
  .get(getArticleDetails);

export default articleRouter;
