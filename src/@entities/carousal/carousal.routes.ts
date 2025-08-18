import express from "express";

import {
  saveHomeCarousalItem,
  getHomeCarousal,
  deleteCarousalItem,
  updateHomeCarousalItem,
} from "./carousal.controller";
import { upload } from "../../helpers/s3";
import { isAdmin } from "../../middlewares/auth";

const carousalRouter = express.Router();

carousalRouter
  .route("/home")
  .post(isAdmin, upload.single("file"), saveHomeCarousalItem)
  .get(getHomeCarousal);

carousalRouter
  .route("/home/:id")
  .delete(isAdmin, deleteCarousalItem)
  .put(isAdmin, updateHomeCarousalItem);

export default carousalRouter;
