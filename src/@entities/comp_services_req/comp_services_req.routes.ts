import express from "express";

import {
  getServiceRequests,
  createServiceRequest,
  updateStatus,
  deleteServiceRequest,
} from "./comp_services_req.controller";
import { isAdmin } from "../../middlewares/auth";
import { validateData } from "../../middlewares/validation";
import { createCompServicesReqSchema } from "./comp_services_req.model";

const compServiceReqRouter = express.Router();

compServiceReqRouter
  .route("/")
  .get(isAdmin, getServiceRequests)
  .post(validateData(createCompServicesReqSchema), createServiceRequest);

compServiceReqRouter
  .route("/:id")
  .put(isAdmin, updateStatus)
  .delete(isAdmin, deleteServiceRequest);

export default compServiceReqRouter;
