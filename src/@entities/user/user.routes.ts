import express from "express";

import {
  getUserSessions,
  logoutFromOtherDevices,
  signinUser,
  signup,
  deleteUserAccount,
  changeUserPassword,
  logoutUser,
} from "./user.controller";
import { validateData } from "../../middlewares/validation";
import { createUserSchema } from "./user.model";
import { isUser } from "../../middlewares/auth";
import { logoutService } from "./user.service";

const userRouter = express.Router();

userRouter.post("/signup", validateData(createUserSchema), signup);
userRouter.post("/signin", signinUser);
userRouter.delete("/logout", isUser, logoutUser);

userRouter.put("/change-password", isUser, changeUserPassword);
userRouter.delete("/delete-account", isUser, deleteUserAccount);

userRouter.get("/sessions", isUser, getUserSessions);
userRouter.delete("/sessions", isUser, logoutFromOtherDevices);

export default userRouter;
