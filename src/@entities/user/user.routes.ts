import express from "express";

import { signup } from "./user.controller";
import { validateData } from "../../middlewares/validation";
import { createUserSchema } from "./user.model";

const userRouter = express.Router();

userRouter.post("/signup", validateData(createUserSchema), signup);

export default userRouter;
