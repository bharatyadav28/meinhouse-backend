import { Request, Response } from "express";
import { and, eq, sql } from "drizzle-orm";

import { db } from "../../db";
import { CompServicesReq } from "./comp_services_req.model";
import { compServiceStatusEnumType } from "../../types/general-types";
import { CompServices } from "../comp_services/comp_services.model";

export const getServiceRequests = async (req: Request, res: Response) => {
  const { search, service, status } = req.query;

  const baseConditions = [eq(CompServicesReq.isDeleted, false)];
  if (search) {
    baseConditions.push(
      sql`(
            ${CompServicesReq.name} ILIKE ${`%${search}%`}
        ) 
        OR 
        (
            ${CompServicesReq.email} ILIKE ${`%${search}%`}
        )
        OR
        (
            ${CompServicesReq.mobile} ILIKE ${`%${search}%`}
        )
        `
    );
  }

  if (
    status &&
    ["pending", "contacted", "completed", "cancelled"].includes(
      status as string
    )
  ) {
    baseConditions.push(
      eq(CompServicesReq.status, status as compServiceStatusEnumType)
    );
  }

  if (service) {
    baseConditions.push(eq(CompServicesReq.comp_service_id, service as string));
  }

  const serviceReq = await db
    .select({
      id: CompServicesReq.id,
      comp_service_id: CompServicesReq.comp_service_id,
      name: CompServicesReq.name,
      email: CompServicesReq.email,
      mobile: CompServicesReq.mobile,
      address: CompServicesReq.address,
      notes: CompServicesReq.notes,
      status: CompServicesReq.status,
      createdAt: CompServicesReq.createdAt,
    })
    .from(CompServicesReq)
    .where(and(...baseConditions));

  if (!serviceReq || serviceReq.length === 0) {
    throw new Error("No service requests found");
  }

  return res.status(200).json({
    success: true,
    data: serviceReq,
  });
};

export const createServiceRequest = async (req: Request, res: Response) => {
  const data = req.cleanBody;
  const { status, ...filterdData } = data;

  const serviceReq = await db
    .insert(CompServicesReq)
    .values(filterdData)
    .returning();

  if (!serviceReq || serviceReq.length === 0) {
    throw new Error("Failed to create service request");
  }

  return res.status(201).json({
    success: true,
    message: "Service request created successfully",
  });
};

export const updateStatus = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { status } = req.body;

  const serviceReq = await db
    .update(CompServicesReq)
    .set({ status, updatedAt: new Date() })
    .where(eq(CompServicesReq.id, id))
    .returning();

  if (!serviceReq || serviceReq.length === 0) {
    throw new Error("Failed to update service request");
  }

  return res.status(200).json({
    success: true,
    message: "Service request updated successfully",
  });
};

export const deleteServiceRequest = async (req: Request, res: Response) => {
  const { id } = req.params;
  const now = new Date();

  const serviceReq = await db
    .update(CompServicesReq)
    .set({ isDeleted: true, updatedAt: now, deletedAt: now })
    .where(eq(CompServicesReq.id, id))
    .returning();

  if (!serviceReq || serviceReq.length === 0) {
    throw new Error("Failed to delete service request");
  }

  return res.status(200).json({
    success: true,
    message: "Service request deleted successfully",
  });
};
