import express, { Request, Response } from "express";
import "dotenv/config";
import "express-async-errors";
import cors from "cors";
import path from "path";
import morgan from "morgan";
import chalk from "chalk";

import errorMiddleware from "./middlewares/error";
import pageNotFound from "./middlewares/pageNotFound";

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));

const istLogger = morgan((tokens, req, res) => {
  const istTime = new Date().toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    hour12: false,
  });

  return [
    chalk.blue(`[${istTime}]`),
    chalk.green(tokens.method(req, res)),
    chalk.magenta(tokens.url(req, res)),
    chalk.yellow(tokens.status(req, res)),
    chalk.white("-"),
    chalk.red(`${tokens["response-time"](req, res)} ms`),
  ].join(" ");
});
app.use(istLogger);

app.get("/", (_, res: Response) =>
  res.sendFile(path.join(__dirname, "../public", "index.html"))
);

import { roleRouter } from "./@entities/role";
import { trimStringFields } from "./middlewares/trim";
import { userRouter } from "./@entities/user";
import { adminRouter } from "./@entities/admin";
import { carousalRouter } from "./@entities/carousal";
import { clientReviewRouter } from "./@entities/client_reviews";
import { articleRouter } from "./@entities/article";
import { getNewAccessToken } from "./middlewares/auth";

app.use((req, res, next) => {
  if (req.method === "POST" || req.method === "PUT") {
    return trimStringFields(req, res, next);
  }
  next();
});

app.use("/api/v1/role", roleRouter);
app.use("/api/v1/user", userRouter);
app.use("/api/v1/admin", adminRouter);
app.use("/api/v1/carousal", carousalRouter);
app.use("/api/v1/client-reviews", clientReviewRouter);
app.use("/api/v1/article", articleRouter);

app.get("/api/v1/new-access-token", getNewAccessToken);

// Notfound and error middlewares
app.use(pageNotFound);
app.use(errorMiddleware);

export default app;
