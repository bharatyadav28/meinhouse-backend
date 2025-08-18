import { Request, Response } from "express";

import { BadRequestError } from "../../errors";
import { s3Uploadv4 } from "../../helpers/s3";
import { cdnURL } from "../../helpers/utils";
import { db } from "../../db";
import { Carousal } from "./carousal.model";
import { asc, eq } from "drizzle-orm";

export const uploadHomeCarousalImage = async (req: Request, res: Response) => {
  if (!req.file) {
    throw new BadRequestError("Please upload an file");
  }

  const folder = "carousal";
  const uploadResult = await s3Uploadv4(req.file, folder);

  const path = `${uploadResult.Key}`;

  const savedImage = await db
    .insert(Carousal)
    .values({
      type: "home",
      image_path: path,
    })
    .returning();

  if (!savedImage || savedImage?.length === 0) {
    throw new Error("Failed to save image");
  }

  return res.status(200).json({
    success: true,
    message: "Image uploaded successfully",
  });
};

export const getHomeCarousal = async (req: Request, res: Response) => {
  const carousals = await db
    .select({ id: Carousal.id, image_path: Carousal.image_path })
    .from(Carousal)
    .where(eq(Carousal.type, "home"))
    .orderBy(asc(Carousal.createdAt));

  return res.status(200).json({
    success: true,
    data: carousals,
  });
};
