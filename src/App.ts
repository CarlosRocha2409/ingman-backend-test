import * as bodyParser from "body-parser";
import express from "express";
import "dotenv/config";
import { ApiError } from "./error-handling/ApiError";
import cors from "cors";
import { BAD_REQUEST, FORBIDDEN, INTERNAL_SERVER } from "./types/error.type";
import logger from "./logger/api.logger";
import ProductRouter from "./routers/product.router";

class App {
  public express: express.Application;

  private whitelist = [
    "http://127.0.0.1:5173",
    "http://localhost:5173",
    "http://localhost:5000",
    "https://bouncer-frontend.vercel.app",
    "https://dli-hall-pass.vercel.app",
    "https://hallpass.degenape.academy",
    "http://127.0.0.1:4173",
    "*",
  ];

  constructor() {
    this.express = express();
    this.middleware();
    this.routes();
  }

  // Configure Express middleware.
  private middleware(): void {
    this.express.use(
      cors({
        credentials: true,
        origin: (origin, callback) => {
          if (origin && this.whitelist.indexOf(origin) !== -1) {
            callback(null, true);
          } else {
            callback(new ApiError("Not Authorized", FORBIDDEN));
          }
        },
      })
    );
    this.express.use((req, __, next) => {
      logger.info(`[HTTP Request ${req.method}]: ${req.url}`);
      next();
    });
    this.express.use(bodyParser.json());
    this.express.use(bodyParser.urlencoded({ extended: false }));
  }

  private routes(): void {
    // Custom Routes
    this.express.use("/api/product", ProductRouter);

    // swagger docs

    this.express.get("/", (req, res, next) => {
      res.send("Typescript App works!!");
    });

    // handle undefined routes
    this.express.use("*", (req, res, next) => {
      res.send("Make sure url is correct!!!");
    });

    this.express.use((e: ApiError, req: any, res: any, next: any) => {
      console.log(e);
      res.status(e.statusCode).json({
        name: e.message,
        message: e.name,
        status: e.statusCode ?? INTERNAL_SERVER,
      });
    });
  }
}

export default new App().express;
