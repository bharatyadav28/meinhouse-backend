import express from "express";

import { validateData } from "../../middlewares/validation";
import { createAddressSchema } from "./address.model";
import { addUserAddress, getAllUserAddress } from "./address.controller";
import { isUser } from "../../middlewares/auth";

const addressRouter = express.Router();

addressRouter
  .route("/")
  .get(isUser, getAllUserAddress)
  .post(isUser, validateData(createAddressSchema), addUserAddress);

export default addressRouter;
