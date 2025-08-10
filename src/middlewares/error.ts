import { Request, Response, NextFunction } from "express";
import multer from "multer";
import { z } from "zod";
import { DrizzleError } from "drizzle-orm";
import { DatabaseError } from "pg";

interface CustomError extends Error {
  statusCode?: number;
  code?: string | number;
  detail?: string;
}

const isPgError = (err: any): err is DatabaseError =>
  !!err && typeof err === "object" && "code" in err && "severity" in err;

const formatZodIssuePath = (path: ReadonlyArray<PropertyKey>) =>
  path
    .map((p) => {
      if (typeof p === "number") return `[${p}]`;
      if (typeof p === "string") return p;
      // symbol (or anything else) -> stringify
      return p.toString();
    })
    .join(".")
    .replace(/\.\[/g, "[");

const errorMiddleware = (
  error: CustomError,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  const originalStatus = error.statusCode;

  // Default
  let statusCode =
    originalStatus && Number.isInteger(originalStatus) ? originalStatus : 500;
  let message = error.message || "Internal Server Error";

  // Multer
  if (error instanceof multer.MulterError) {
    statusCode = 400;
    switch (error.code) {
      case "LIMIT_FILE_SIZE":
        message = "File size exceeds limit";
        break;
      case "LIMIT_FILE_COUNT":
        message = "Too many files uploaded";
        break;
      case "LIMIT_UNEXPECTED_FILE":
        message = "Unexpected file field";
        break;
      default:
        message = error.message;
    }
  }

  // Zod
  else if (error instanceof z.ZodError) {
    statusCode = 400;
    message = error.issues
      .map((i) => `${formatZodIssuePath(i.path) || "value"}: ${i.message}`)
      .join("; ");
  }

  // Drizzle (surface cause if helpful)
  else if (error instanceof DrizzleError) {
    statusCode = statusCode === 500 ? 500 : statusCode;
    if ((error as any).cause instanceof Error) {
      message =
        (error as any).cause.message || `Database error: ${error.message}`;
    } else {
      message = `Database error: ${error.message}`;
    }
  }

  // Native pg errors
  else if (isPgError(error)) {
    switch (error.code) {
      case "23505": {
        // unique_violation
        statusCode = 400;
        const match = error.detail?.match(/Key \((.*?)\)=\((.*?)\)/);
        const field = match?.[1] || "field";
        // optionally extract value: const value = match?.[2];
        message = `Duplicate value for ${field}`;
        break;
      }
      case "23503": // foreign_key_violation
        statusCode = 400;
        message = "Foreign key constraint violation";
        break;
      case "23502": // not_null_violation
        statusCode = 400;
        message = "Required field is missing";
        break;
      case "23514": // check_violation
        statusCode = 400;
        message = "Constraint check failed";
        break;
      default:
        statusCode = statusCode === 500 ? 500 : statusCode;
        message = error.message || "Database error";
    }
  }

  // Not found heuristics (only if still 500)
  if (
    statusCode === 500 &&
    (message.toLowerCase().includes("not found") ||
      message.includes("No rows returned") ||
      error.code === "RESOURCE_NOT_FOUND")
  ) {
    statusCode = 404;
    message = message || "Resource not found";
  }

  message = message.trim();

  if (process.env.NODE_ENV !== "production") {
    // Structured log
    // eslint-disable-next-line no-console
    console.error("[Error]", {
      name: error.name,
      message: error.message,
      handledMessage: message,
      code: (error as any).code,
      statusCode,
      stack: error.stack,
    });
  }

  return res.status(statusCode).json({
    success: false,
    message,
    statusCode,
  });
};

export default errorMiddleware;
