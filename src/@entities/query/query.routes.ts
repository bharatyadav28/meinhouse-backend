import express from "express";
import { submitQuery } from "./query.controller";
import { validateData } from "../../middlewares/validation";
import { createQuerySchema } from "./query.model";

const queryRouter = express.Router();

queryRouter.route("/").post(validateData(createQuerySchema), submitQuery);

export default queryRouter;
