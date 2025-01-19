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
import { reviewsRouter } from "./routers/reviews.router";
import { seedRouter } from "./routers/seed.router";
// Security
import rateLimiter from "express-rate-limit";
import helmet from "helmet";
import mongoSanitizer from "express-mongo-sanitize";
const app = express();
app.use(
  cors({
    origin: configs.clientUrl,
    credentials: true,
  })
);
app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(loggerMiddleware);
app.use(authMiddleware);

// Security
app.use(
  rateLimiter({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: "Too many requests from this IP, please try again after an hour",
  })
);

app.use(helmet());

app.use(mongoSanitizer());
// Routes
app.use("/api", authRouter);
app.use("/api", estatesRouter);
app.use("/api", reviewsRouter);
app.use("/api", seedRouter);

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
