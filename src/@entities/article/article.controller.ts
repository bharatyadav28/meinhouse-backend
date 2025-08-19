import { Request, Response } from "express";
import { desc, eq } from "drizzle-orm";

import { db } from "../../db";
import { Article } from "./article.model";
import de from "zod/v4/locales/de.js";
import { getURLPath } from "../../helpers/utils";

export const createArticle = async (req: Request, res: Response) => {
  const data = req.cleanBody;
  const newData = { ...data };

  if (data?.picPath) {
    let picPath = getURLPath(data.picPath);
    newData.picPath = picPath;
  }

  const article = await db.insert(Article).values(newData).returning();
  if (!article || article.length === 0) {
    throw new Error("Failed to create article");
  }

  res
    .status(201)
    .json({ success: true, message: "Article created successfully" });
};

export const getArticles = async (req: Request, res: Response) => {
  const articles = await db
    .select({
      id: Article.id,
      title: Article.title,
      description: Article.description,
      picPath: Article.picPath,
    })
    .from(Article)
    .orderBy(desc(Article.createdAt));

  return res.status(200).json({
    success: true,
    message: "Articles fetched successfully",
    data: { articles },
  });
};

export const getArticleDetails = async (req: Request, res: Response) => {
  const { id } = req.params;

  const article = await db
    .select()
    .from(Article)
    .where(eq(Article.id, id))
    .limit(1);

  if (!article || article.length === 0) {
    return res.status(404).json({
      success: false,
      message: "Article not found",
    });
  }

  return res.status(200).json({
    success: true,
    message: "Article fetched successfully",
    data: { article: article[0] },
  });
};

export const updateArticle = async (req: Request, res: Response) => {
  const { id } = req.params;
  const data = req.cleanBody;
  const updatedData = { ...data, updatedAt: new Date() };

  if (data?.picPath) {
    let picPath = getURLPath(data.picPath);
    updatedData.picPath = picPath;
  }

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
