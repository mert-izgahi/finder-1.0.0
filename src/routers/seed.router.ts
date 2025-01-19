import express from "express";
import { tryCatch } from "../middlewares/try-catch.middleware";
import { withAuth } from "../middlewares/auth.middleware";

import { seedEstates } from "../controllers/seed.controller";

const router = express.Router();

router.post("/seed-estates", withAuth, tryCatch(seedEstates));

export { router as seedRouter };
