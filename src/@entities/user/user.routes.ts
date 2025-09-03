import express from "express";

import {
  getUserSessions,
  logoutFromOtherDevices,
  signinUser,
  signup,
} from "./user.controller";
import { validateData } from "../../middlewares/validation";
import { createUserSchema } from "./user.model";
import { isUser } from "../../middlewares/auth";

const userRouter = express.Router();

userRouter.post("/signup", validateData(createUserSchema), signup);
userRouter.post("/signin", signinUser);
userRouter.get("/sessions", isUser, getUserSessions);
userRouter.delete("/sessions", isUser, logoutFromOtherDevices);

export default userRouter;
