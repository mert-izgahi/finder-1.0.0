import express from "express";
import { AnyZodObject } from "zod";
import { tryCatch } from "../middlewares/try-catch.middleware";
import { validate } from "../middlewares/validate.middleware";
import { reviewSchema } from "../lib/zod";
import { withAuth } from "../middlewares/auth.middleware";

import {
  createReview,
  deleteReview,
  updateReview,
  getCreatedReviews,
  getRecievedReviews,
} from "../controllers/reviews.controller";

const router = express.Router();

router.post(
  "/create",
  validate(reviewSchema as any as AnyZodObject),
  withAuth,
  tryCatch(createReview)
);
router.delete("/delete/:id", withAuth, tryCatch(deleteReview));
router.put(
  "/update/:id",
  validate(reviewSchema as any as AnyZodObject),
  withAuth,
  tryCatch(updateReview)
);
router.get("/created", withAuth, tryCatch(getCreatedReviews));
router.get("/received", withAuth, tryCatch(getRecievedReviews));

export { router as reviewsRouter };
