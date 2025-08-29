import express from "express";

import { validateData } from "../../middlewares/validation";
import { createServiceSchema, updateServiceSchema } from "./service.model";
import {
  addNewService,
  getServices,
  getServiceById,
  updateService,
  updateServiceStatus,
} from "./service.controller";

const serviceRouter = express.Router();

serviceRouter
  .route("/")
  .post(validateData(createServiceSchema), addNewService)
  .get(getServices);
serviceRouter
  .route("/:id")
  .get(getServiceById)
  .put(validateData(updateServiceSchema), updateService);
serviceRouter.route("/:id/status").put(updateServiceStatus);

export default serviceRouter;
