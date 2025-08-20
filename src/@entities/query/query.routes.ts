import express from "express";

import { getAllQueries, submitQuery, deleteQuery } from "./query.controller";
import { validateData } from "../../middlewares/validation";
import { createQuerySchema } from "./query.model";
import { isAdmin } from "../../middlewares/auth";

const queryRouter = express.Router();

queryRouter
  .route("/")
  .post(validateData(createQuerySchema), submitQuery)
  .get(isAdmin, getAllQueries);

queryRouter.route("/:id").delete(isAdmin, deleteQuery);

export default queryRouter;
