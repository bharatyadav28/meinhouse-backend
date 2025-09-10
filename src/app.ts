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
import { compServicesRouter } from "./@entities/comp_services";
import { compServicesReqRouter } from "./@entities/comp_services_req";
import { queryRouter } from "./@entities/query";
import { pagesRouter } from "./@entities/pages";
import { educationRouter } from "./@entities/education";
import { getNewAccessToken } from "./middlewares/auth";
import { tokenRouter } from "./@entities/auth_token";
import { serviceRouter } from "./@entities/service";
import professionalRouter from "./@entities/professional/professional.routes";

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
app.use("/api/v1/comp-services", compServicesRouter);
app.use("/api/v1/comp-services-req", compServicesReqRouter);
app.use("/api/v1/query", queryRouter);
app.use("/api/v1/pages", pagesRouter);
app.use("/api/v1/education", educationRouter);
app.use("/api/v1/token", tokenRouter);
app.use("/api/v1/services", serviceRouter);
app.use("/api/v1/professional", professionalRouter);

app.get("/api/v1/new-access-token", getNewAccessToken);

// Notfound and error middlewares
app.use(pageNotFound);
app.use(errorMiddleware);

export default app;
