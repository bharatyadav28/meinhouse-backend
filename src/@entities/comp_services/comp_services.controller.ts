import { Request, Response } from "express";
import { eq } from "drizzle-orm";
import { BadRequestError } from "../../errors";

import { db } from "../../db";
import { CompServices } from "./comp_services.model";
import { getURLPath } from "../../helpers/utils";

export const createCompService = async (req: Request, res: Response) => {
  const { picPath, name, description } = req.body;

  if (!picPath || !name) {
    throw new BadRequestError("Picture URL and Name fields are required");
  }

  const data = { picPath: getURLPath(picPath), name, description };

  const service = await db.insert(CompServices).values(data).returning();
  if (!service || service.length === 0) {
    throw new Error("Failed to create company service");
  }

  res.status(201).json({
    success: true,
    message: "Service created successfully",
  });
};

export const getCompServices = async (req: Request, res: Response) => {
  const services = await db
    .select({
      id: CompServices.id,
      picPath: CompServices.picPath,
      name: CompServices.name,
    })
    .from(CompServices)
    .where(eq(CompServices.isDeleted, false));

  res.status(200).json({
    success: true,
    message: "Services retrieved successfully",
    data: {
      services,
    },
  });
};

export const updateCompService = async (req: Request, res: Response) => {
  const serviceId = req.params.id;
  const { picPath, name, description } = req.body;

  if (!picPath || !name) {
    throw new BadRequestError("Picture URL and Name fields are required");
  }

  const data = { picPath: getURLPath(picPath), name, description };

  const service = await db
    .update(CompServices)
    .set(data)
    .where(eq(CompServices.id, serviceId))
    .returning();
  if (!service || service.length === 0) {
    throw new Error("Failed to update company service");
  }

  res.status(200).json({
    success: true,
    message: "Service updated successfully",
  });
};

export const deleteCompService = async (req: Request, res: Response) => {
  const serviceId = req.params.id;
  const data = {
    isDeleted: true,
    deletedAt: new Date(),
  };

  const service = await db
    .update(CompServices)
    .set(data)
    .where(eq(CompServices.id, serviceId))
    .returning();
  if (!service || service.length === 0) {
    throw new Error("Failed to delete service");
  }

  res.status(200).json({
    success: true,
    message: "Service deleted successfully",
  });
};
