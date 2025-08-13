import express from "express";
import { createRole, fetchRoles } from "./role.controller";
import { isAdmin } from "../../middlewares/auth";

const roleRouter = express.Router();

roleRouter.route("/").post(isAdmin, createRole).get(isAdmin, fetchRoles);

export default roleRouter;
