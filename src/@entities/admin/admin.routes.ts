import express from "express";

import { adminSignin, uploadFile } from "./admin.controller";
import { validateData } from "../../middlewares/validation";
import { signinUserSchema } from "../user/user.model";
import { upload } from "../../helpers/s3";
import { isAdmin } from "../../middlewares/auth";

const adminRouter = express.Router();

adminRouter.route("/signin").post(validateData(signinUserSchema), adminSignin);

adminRouter.route("/upload").post(isAdmin, upload.single("file"), uploadFile);

export default adminRouter;
