import { Request, Response } from "express";
import { asc, eq, or } from "drizzle-orm";

import { db } from "../../db";
import { Services } from "./service.model";
import { getURLPath } from "../../helpers/utils";

export const addNewService = async (req: Request, res: Response) => {
  const data = req.cleanBody;
  const restructuredData = { ...data };

  let iconPath = getURLPath(restructuredData.iconPath);
  let imagePath = getURLPath(restructuredData.imagePath);
  restructuredData.iconPath = iconPath;
  restructuredData.imagePath = imagePath;

  const newService = await db
    .insert(Services)
    .values(restructuredData)
    .returning();

  if (!newService || newService.length === 0) {
    throw new Error("Service creation failed");
  }

  return res.status(201).json({
    success: true,
    message: "Service created successfully",
  });
};

export const updateService = async (req: Request, res: Response) => {
  const serviceId = req.params.id;
  const data = req.body;

  const restructuredData = { ...data };

  if (data?.iconPath) {
    let iconPath = getURLPath(restructuredData.iconPath);
    restructuredData.iconPath = iconPath;
  }
  if (data?.imagePath) {
    let imagePath = getURLPath(restructuredData.imagePath);
    restructuredData.imagePath = imagePath;
  }

  const updatedService = await db
    .update(Services)
    .set(restructuredData)
    .where(eq(Services.id, serviceId))
    .returning();

  if (!updatedService || updatedService.length === 0) {
    throw new Error("Service update failed");
  }

  return res.status(200).json({
    success: true,
    message: "Service updated successfully",
  });
};

export const getServices = async (req: Request, res: Response) => {
  const { currentPage } = req.query;

  const page = typeof currentPage === "number" ? currentPage : 1;
  const limit = 15;

  const services = await db
    .select({
      id: Services.id,
      name: Services.name,
      iconPath: Services.iconPath,
      status: Services.status,
    })
    .from(Services)
    .orderBy(asc(Services.createdAt))
    .limit(limit)
    .offset((page - 1) * limit);

  return res.status(200).json({
    success: true,
    data: { services },
  });
};

export const getServiceById = async (req: Request, res: Response) => {
  const serviceId = req.params.id;

  const service = await db
    .select()
    .from(Services)
    .where(or(eq(Services.id, serviceId), eq(Services.slug, serviceId)))
    .limit(1);

  if (!service || service.length === 0) {
    return res.status(404).json({
      success: false,
      message: "Service not found",
    });
  }

  return res.status(200).json({
    success: true,
    message: "Service retrieved successfully",
    data: { service },
  });
};

export const updateServiceStatus = async (req: Request, res: Response) => {
  const serviceId = req.params.id;
  const { status } = req.body;

  const updatedService = await db
    .update(Services)
    .set({ status })
    .where(eq(Services.id, serviceId))
    .returning();

  if (!updatedService || updatedService.length === 0) {
    return res.status(404).json({
      success: false,
      message: "Service not found",
    });
  }

  return res.status(200).json({
    success: true,
    message: "Service status updated successfully",
  });
};
