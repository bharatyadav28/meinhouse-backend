import express from "express";
import { isAdmin } from "../../middlewares/auth";
import { validateData } from "../../middlewares/validation";
import {
  createCompService,
  getCompServices,
  updateCompService,
  deleteCompService,
} from "./comp_services.controller";

const compServicesRouter = express.Router();

compServicesRouter
  .route("/")
  .post(isAdmin, createCompService)
  .get(getCompServices);

compServicesRouter
  .route("/:id")
  .put(isAdmin, updateCompService)
  .delete(isAdmin, deleteCompService);

export default compServicesRouter;
