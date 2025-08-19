import { Request, Response } from "express";
import { URL } from "url";

import { db } from "../../db";
import { Carousal } from "./carousal.model";
import { and, asc, eq } from "drizzle-orm";
import { BadRequestError } from "../../errors";
import { getURLPath } from "../../helpers/utils";

export const saveHomeCarousalItem = async (req: Request, res: Response) => {
  const { imagePath, title } = req.body;

  if (!imagePath || !title) {
    throw new BadRequestError("Image path and title are required");
  }

  const data = {
    type: "home",
    imagePath: getURLPath(imagePath),
    title,
  };

  const savedItem = await db.insert(Carousal).values(data).returning();

  if (!savedItem || savedItem?.length === 0) {
    throw new Error("Failed to save image");
  }

  return res.status(201).json({
    success: true,
    message: "Saved successfully",
  });
};

export const getHomeCarousal = async (req: Request, res: Response) => {
  const carousals = await db
    .select({
      id: Carousal.id,
      imagePath: Carousal.imagePath,
      title: Carousal.title,
    })
    .from(Carousal)
    .where(and(eq(Carousal.type, "home"), eq(Carousal.type, "home")))
    .orderBy(asc(Carousal.createdAt));

  return res.status(200).json({
    success: true,
    message: "Carousal fetched successfully",
    data: { carousals },
  });
};

export const updateHomeCarousalItem = async (req: Request, res: Response) => {
  const { imagePath, title } = req.body;
  const itemId = req.params.id;

  const data = {
    type: "home",
    imagePath: getURLPath(imagePath),
    title,
  };

  console.log("Image path", imagePath);

  const updatedItem = await db
    .update(Carousal)
    .set(data)
    .where(eq(Carousal.id, itemId))
    .returning();

  if (!updatedItem || updatedItem?.length === 0) {
    throw new Error("Failed to update image");
  }

  return res.status(200).json({
    success: true,
    message: "Updated successfully",
  });
};

export const deleteCarousalItem = async (req: Request, res: Response) => {
  const { id } = req.params;

  const deletedItem = await db
    .delete(Carousal)
    .where(eq(Carousal.id, id))
    .returning();

  if (!deletedItem || deletedItem?.length === 0) {
    throw new Error("Failed to delete image");
  }

  return res.status(200).json({
    success: true,
    message: "Deleted successfully",
  });
};
