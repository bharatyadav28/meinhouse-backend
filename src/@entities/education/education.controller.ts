import { Request, Response } from "express";
import { eq } from "drizzle-orm";

import { db } from "../../db";
import { Education } from "./education.model";

export const updateEducation = async (req: Request, res: Response) => {
  const data = req.cleanBody;

  // Check if any education entry exists
  const existingEducation = await db.select().from(Education).limit(1);

  if (existingEducation && existingEducation.length > 0) {
    // Update existing entry
    const updatedData = { ...data, updatedAt: new Date() };
    const updatedEducation = await db
      .update(Education)
      .set(updatedData)
      .where(eq(Education.id, existingEducation[0].id))
      .returning();

    if (!updatedEducation || updatedEducation.length === 0) {
      throw new Error("Failed to update education entry");
    }

    return res
      .status(200)
      .json({ success: true, message: "Education entry updated successfully" });
  } else {
    // Create new entry
    const newEducation = await db.insert(Education).values(data).returning();
    if (!newEducation || newEducation.length === 0) {
      throw new Error("Failed to create new education entry");
    }

    return res.status(201).json({
      success: true,
      message: "New education entry created successfully",
    });
  }
};

export const getEducation = async (req: Request, res: Response) => {
  const education = await db.select().from(Education).limit(1);

  if (!education || education.length === 0) {
    return res.status(404).json({ message: "Education entry not found" });
  }

  return res.status(200).json({ success: true, data: education[0] });
};
