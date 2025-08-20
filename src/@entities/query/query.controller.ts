import { Request, Response } from "express";
import { db } from "../../db";
import { Query } from "./query.model";

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
