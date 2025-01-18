import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import configs from "./configs";
import { logger } from "./lib/logger";
import { connectDB } from "./lib/connect-db";
// Middlewares
import { loggerMiddleware } from "./middlewares/logger.middleware";
import { errorHandlerMiddleware } from "./middlewares/error-handler.middleware";
import { notFoundMiddleware } from "./middlewares/not-found.middleware";
import { authMiddleware } from "./middlewares/auth.middleware";

// Routes
import { authRouter } from "./routers/auth.router";
import { estatesRouter } from "./routers/estates.router";

const app = express();
app.use(
  cors({
    origin: configs.clientUrl,
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());
app.use(loggerMiddleware);
app.use(authMiddleware);
// Routes

app.use("/api", authRouter);
app.use("/api", estatesRouter);

// Middlewares
app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const start = async () => {
  try {
    await connectDB(configs.dbUrl!);
    app.listen(configs.port, () => {
      logger.info(`Server is listening on port ${configs.port}`);
    });
  } catch (error) {
    logger.error(error);
  }
};

start();
