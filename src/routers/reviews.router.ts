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
  "/create-review",
  validate(reviewSchema as any as AnyZodObject),
  withAuth,
  tryCatch(createReview)
);
router.delete("/delete-review/:id", withAuth, tryCatch(deleteReview));
router.put(
  "/update-review/:id",
  validate(reviewSchema as any as AnyZodObject),
  withAuth,
  tryCatch(updateReview)
);
router.get("/get-created-reviews", withAuth, tryCatch(getCreatedReviews));
router.get("/get-received-reviews", withAuth, tryCatch(getRecievedReviews));

export { router as reviewsRouter };
