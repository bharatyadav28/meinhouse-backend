import express from "express";
import { createRole, fetchRoles } from "./role.controller";

const roleRouter = express.Router();

roleRouter.route("/").post(createRole).get(fetchRoles);

export default roleRouter;
