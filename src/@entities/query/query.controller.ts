import { Request, Response } from "express";
import { db } from "../../db";
import { Query } from "./query.model";
import { desc, eq } from "drizzle-orm";

export const submitQuery = async (req: Request, res: Response) => {
  const data = req.cleanBody;

  const query = await db.insert(Query).values(data).returning();
  if (!query || query.length === 0) {
    throw new Error("Failed to submit query");
  }

  return res
    .status(201)
    .json({ success: true, message: "Query submitted successfully" });
};

export const getAllQueries = async (req: Request, res: Response) => {
  const { page } = req.query;

  const pageSize = 10;
  const pageNumber = page ? parseInt(page as string, 10) : 1;
  const skip = (pageNumber - 1) * pageSize;

  const queries = await db
    .select({
      id: Query.id,
      name: Query.name,
      email: Query.email,
      message: Query.message,
      createdAt: Query.createdAt,
    })
    .from(Query)
    .where(eq(Query.isDeleted, false))
    .orderBy(desc(Query.createdAt))
    .offset(skip)
    .limit(pageSize);

  return res.status(200).json({
    success: true,
    message: "Queries fetched successfully",
    data: { queries },
  });
};

export const deleteQuery = async (req: Request, res: Response) => {
  const { id } = req.params;
  const now = new Date();

  const query = await db
    .update(Query)
    .set({ isDeleted: true, deletedAt: now, updatedAt: now })
    .where(eq(Query.id, id))
    .returning();

  if (!query || query.length === 0) {
    throw new Error("Failed to delete query");
  }

  return res
    .status(200)
    .json({ success: true, message: "Query deleted successfully" });
};
