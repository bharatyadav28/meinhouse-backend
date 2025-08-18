import express from "express";

import { isAdmin } from "../../middlewares/auth";
import { validateData } from "../../middlewares/validation";
import { createReviewSchema } from "./client_reviews.model";
import {
  createReview,
  deleteReview,
  getAllReviews,
  updateReview,
} from "./client_review.controller";

const clientReviewRouter = express.Router();

clientReviewRouter
  .route("/")
  .post(isAdmin, validateData(createReviewSchema), createReview)
  .get(getAllReviews);

clientReviewRouter
  .route("/:id")
  .put(isAdmin, validateData(createReviewSchema), updateReview)
  .delete(isAdmin, deleteReview);

export default clientReviewRouter;
