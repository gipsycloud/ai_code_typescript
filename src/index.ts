import "dotenv/config";
import express, { type ErrorRequestHandler } from "express";
import { productsRouter } from "./routes/products";
import { authRouter } from "./routes/auth";
import { logger } from "./lib/logger";
import prisma from "./lib/prisma";

const app = express();
app.use((req, res, next) => {
  const startedAt = Date.now();
  res.on("finish", () => {
    logger.info("HTTP request", {
      method: req.method,
      path: req.path,
      status: res.statusCode,
      durationMs: Date.now() - startedAt,
    });
  });
  next();
});
app.use(express.json());

app.use("/api/auth", authRouter);

app.get("/health", (_req, res) => res.json({ ok: true }));
app.use("/api/products", productsRouter);

const errorHandler: ErrorRequestHandler = (error, req, res, next) => {
  logger.error("Unhandled application error", error, {
    method: req.method,
    path: req.path,
  });
  if (res.headersSent) {
    next(error);
    return;
  }
  res.status(500).json({ error: "Internal server error" });
};
app.use(errorHandler);

const port = Number(process.env.PORT) || 3000;

async function startServer() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    throw new Error("DATABASE_URL is not set");
  }
  const databaseName = decodeURIComponent(databaseUrl);

  await prisma.$connect();
  logger.info("Database connected", { database: databaseName });

  app.listen(port, () => {
    logger.info("Server listening", { port });
  });
}

startServer().catch(async (error: unknown) => {
  logger.error("Server startup failed", error);
  try {
    await prisma.$disconnect();
  } catch (disconnectError) {
    logger.error("Database disconnect failed after startup error", disconnectError);
  }
  process.exitCode = 1;
});