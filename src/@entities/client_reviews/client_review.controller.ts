import { Request, Response } from "express";
import { db } from "../../db";
import { ClientReview } from "./client_reviews.model";
import { eq } from "drizzle-orm";

export const createReview = async (req: Request, res: Response) => {
  const data = req.cleanBody;

  const review = await db.insert(ClientReview).values(data).returning();

  if (!review || review.length === 0) {
    throw new Error("Failed to create review");
  }

  return res.status(201).json({
    success: true,
    message: "Review created successfully",
  });
};

export const updateReview = async (req: Request, res: Response) => {
  const data = req.cleanBody;
  const reviewId = req.params.id;

  const updatedData = {
    ...data,
    updatedAt: new Date(),
  };

  const review = await db
    .update(ClientReview)
    .set(updatedData)
    .where(eq(ClientReview.id, reviewId))
    .returning();

  if (!review || review.length === 0) {
    throw new Error("Failed to update review");
  }

  return res.status(200).json({
    success: true,
    message: "Review updated successfully",
  });
};

export const getAllReviews = async (req: Request, res: Response) => {
  const reviews = await db.select().from(ClientReview);

  return res.status(200).json({
    success: true,
    message: "Client reviews fetched successfully",
    data: { reviews },
  });
};

export const deleteReview = async (req: Request, res: Response) => {
  const reviewId = req.params.id;

  const review = await db
    .delete(ClientReview)
    .where(eq(ClientReview.id, reviewId))
    .returning();

  if (!review || review.length === 0) {
    throw new Error("Failed to delete review");
  }

  return res.status(200).json({
    success: true,
    message: "Review deleted successfully",
  });
};
