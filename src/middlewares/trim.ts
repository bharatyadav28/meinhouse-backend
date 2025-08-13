import { Request, Response, NextFunction } from "express";

export const trimStringFields = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log("Trim !!!!!!!!!!!!", req.body);
  const trimObject = (obj: any): any => {
    if (obj === null || obj === undefined) return obj;

    if (Array.isArray(obj)) {
      return obj.map(trimObject);
    }

    if (typeof obj === "object") {
      const trimmed: Record<string, any> = {};
      for (const [key, value] of Object.entries(obj)) {
        trimmed[key] = trimObject(value);
      }
      return trimmed;
    }

    if (typeof obj === "string") {
      return obj.trim();
    }

    return obj;
  };

  if (req.body) {
    req.body = trimObject(req.body);
  }

  console.log("complete", "asa");
  next();
};
