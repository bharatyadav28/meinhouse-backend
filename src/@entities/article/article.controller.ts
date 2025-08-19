import { Request, Response } from "express";
import { desc, eq } from "drizzle-orm";

import { db } from "../../db";
import { Article } from "./article.model";

export const createArticle = async (req: Request, res: Response) => {
  const data = req.cleanBody;

  const article = await db.insert(Article).values(data).returning();
  if (!article || article.length === 0) {
    throw new Error("Failed to create article");
  }

  res
    .status(201)
    .json({ success: true, message: "Article created successfully" });
};

export const getArticles = async (req: Request, res: Response) => {
  const articles = await db
    .select()
    .from(Article)
    .orderBy(desc(Article.createdAt));

  return res.status(200).json({
    success: true,
    message: "Articles fetched successfully",
    data: { articles },
  });
};

export const updateArticle = async (req: Request, res: Response) => {
  const { id } = req.params;
  const data = req.cleanBody;
  const updatedData = { ...data, updatedAt: new Date() };

  const article = await db
    .update(Article)
    .set(updatedData)
    .where(eq(Article.id, id))
    .returning();

  if (!article || article.length === 0) {
    throw new Error("Failed to update article");
  }

  res
    .status(200)
    .json({ success: true, message: "Article updated successfully" });
};

export const deleteArticle = async (req: Request, res: Response) => {
  const { id } = req.params;

  const article = await db
    .delete(Article)
    .where(eq(Article.id, id))
    .returning();

  if (!article || article.length === 0) {
    throw new Error("Failed to delete article");
  }

  res
    .status(200)
    .json({ success: true, message: "Article deleted successfully" });
};
