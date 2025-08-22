import { Request, Response } from "express";
import { and, eq, sql } from "drizzle-orm";

import { db } from "../../db";
import { Pages } from "./pages.model";

export const addNewPage = async (req: Request, res: Response) => {
  const data = req.cleanBody;

  const newPage = await db.insert(Pages).values(data).returning();
  if (!newPage || newPage.length === 0) {
    return res.status(500).json({ message: "Failed to create new page" });
  }

  return res
    .status(201)
    .json({ success: true, message: "New page created successfully" });
};

export const getAllPages = async (req: Request, res: Response) => {
  const pages = await db.select().from(Pages);
  return res.status(200).json({ success: true, data: pages });
};

export const updatePage = async (req: Request, res: Response) => {
  const { id } = req.params;
  const data = req.cleanBody;
  const { title, ...filteredData } = data;

  const updatedPage = await db
    .update(Pages)
    .set(filteredData)
    .where(eq(Pages.id, id))
    .returning();

  if (!updatedPage || updatedPage.length === 0) {
    return res.status(500).json({ message: "Failed to update page" });
  }

  return res
    .status(200)
    .json({ success: true, message: "Page updated successfully" });
};

export const getTermsAndConditionsPage = async (
  req: Request,
  res: Response
) => {
  const termsPage = await db
    .select()
    .from(Pages)
    .where(
      and(
        sql`${Pages.title} ILIKE ${"%Terms and Conditions%"}`,
        eq(Pages.status, "active")
      )
    )
    .limit(1)
    .execute();

  if (!termsPage || termsPage.length === 0) {
    return res
      .status(404)
      .json({ message: "Terms and Conditions page not found" });
  }

  return res
    .status(200)
    .json({ success: true, data: { content: termsPage[0] } });
};

export const getPrivacyPolicy = async (req: Request, res: Response) => {
  const privacyPolicyPage = await db
    .select()
    .from(Pages)
    .where(
      and(
        sql`${Pages.title} ILIKE ${"%Privacy Policy%"}`,
        eq(Pages.status, "active")
      )
    )
    .limit(1)
    .execute();

  if (!privacyPolicyPage || privacyPolicyPage.length === 0) {
    return res.status(404).json({ message: "Privacy Policy page not found" });
  }

  return res
    .status(200)
    .json({ success: true, data: { content: privacyPolicyPage[0] } });
};

export const getAboutUs = async (req: Request, res: Response) => {
  const aboutUsPage = await db
    .select()
    .from(Pages)
    .where(
      and(sql`${Pages.title} ILIKE ${"%About Us%"}`, eq(Pages.status, "active"))
    )
    .limit(1)
    .execute();

  if (!aboutUsPage || aboutUsPage.length === 0) {
    return res.status(404).json({ message: "About Us page not found" });
  }

  return res
    .status(200)
    .json({ success: true, data: { content: aboutUsPage[0] } });
};
