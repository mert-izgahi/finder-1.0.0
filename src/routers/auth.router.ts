import express from "express";
import { AnyZodObject } from "zod";
import { signIn, signUp, signOut, getMe } from "../controllers/auth.controller";
import { tryCatch } from "../middlewares/try-catch.middleware";
import { validate } from "../middlewares/validate.middleware";
import { signInSchema, signUpSchema } from "../lib/zod";
import { withAuth } from "../middlewares/auth.middleware";

const router = express.Router();

router.post(
  "/sign-up",
  validate(signUpSchema as any as AnyZodObject),
  tryCatch(signUp)
);
router.post(
  "/sign-in",
  validate(signInSchema as any as AnyZodObject),
  tryCatch(signIn)
);

router.post("/sign-out", tryCatch(signOut));
router.get("/get-me", withAuth, tryCatch(getMe));

export { router as authRouter };
