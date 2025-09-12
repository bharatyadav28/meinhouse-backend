import { Request, Response } from "express";
import { eq } from "drizzle-orm";

import { Address } from "./address.model";
import { db } from "../../db";

export const addUserAddress = async (req: Request, res: Response) => {
  const data = req.cleanBody;
  const userId = req.user.id;

  const address = await db
    .insert(Address)
    .values({ userId, ...data })
    .returning();
  if (!address || address.length === 0) {
    throw new Error("Failed to add address");
  }

  res
    .status(201)
    .json({ success: true, message: "Address added successfully" });
};

export const getAllUserAddress = async (req: Request, res: Response) => {
  const userId = req.user.id;

  const addresses = await db
    .select()
    .from(Address)
    .where(eq(Address.userId, userId));
  if (!addresses || addresses.length === 0) {
    throw new Error("Failed to add address");
  }

  res
    .status(200)
    .json({
      success: true,
      message: "Addresses fetched successfully",
      data: { addresses },
    });
};
