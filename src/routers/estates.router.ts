import express from "express";
import { AnyZodObject } from "zod";
import { tryCatch } from "../middlewares/try-catch.middleware";
import { validate } from "../middlewares/validate.middleware";
import { estateSchema } from "../lib/zod";
import { withAuth } from "../middlewares/auth.middleware";

import {
  createEstate,
  deleteEstate,
  getEstate,
  getEstates,
  getMyEstates,
  getTopViewedEstatesBy,
  updateEstate,
} from "../controllers/estate.controller";

const router = express.Router();

router.get("/get-estates", tryCatch(getEstates));
router.get("/get-estate/:id", tryCatch(getEstate));
router.get("/get-my-estates", withAuth, tryCatch(getMyEstates));
router.get("/get-top-viewed-estates-by/:by", tryCatch(getTopViewedEstatesBy));
router.post(
  "/create-estate",
  withAuth,
  validate(estateSchema as any as AnyZodObject),
  tryCatch(createEstate)
);
router.put(
  "/update-estate/:id",
  withAuth,
  validate(estateSchema as any as AnyZodObject),
  tryCatch(updateEstate)
);
router.delete("/delete-estate/:id", withAuth, tryCatch(deleteEstate));

export { router as estatesRouter };
