import express from "express";

import {
  uploadHomeCarousalImage,
  getHomeCarousal,
} from "./carousal.controller";
import { upload } from "../../helpers/s3";
import { isAdmin } from "../../middlewares/auth";

const carousalRouter = express.Router();

carousalRouter
  .route("/home")
  .post(isAdmin, upload.single("file"), uploadHomeCarousalImage)
  .get(getHomeCarousal);

export default carousalRouter;
