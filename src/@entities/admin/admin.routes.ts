import express from "express";

import { adminSignin } from "./admin.controller";
import { validateData } from "../../middlewares/validation";
import { signinUserSchema } from "../user/user.model";

const adminRouter = express.Router();

adminRouter.route("/signin").post(validateData(signinUserSchema), adminSignin);

export default adminRouter;
