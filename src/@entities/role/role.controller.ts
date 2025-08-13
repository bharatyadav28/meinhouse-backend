import { Request, Response } from "express";

import { db } from "../../db";
import { Role } from "./role.model";

export const createRole = async (req: Request, res: Response) => {
  const { name } = req.body;

  const role = await db.insert(Role).values({ name }).returning();

  if (!role || role.length === 0) {
    throw new Error("Failed to create role");
  }

  return res.status(201).json({
    success: true,
    message: "New role created successfully",
    data: {
      role: role?.[0],
    },
  });
};

export const fetchRoles = async (req: Request, res: Response) => {
  const roles = await db
    .select({
      name: Role.name,
    })
    .from(Role);

  const enhancedRoles: string[] = [];

  if (roles && roles.length > 0) {
    roles.forEach((role) => {
      if (role?.name) {
        enhancedRoles.push(role.name);
      }
    });
  }

  return res.status(200).json({
    success: true,
    message: "Roles fetched successfully",
    data: {
      roles: enhancedRoles,
    },
  });
};
