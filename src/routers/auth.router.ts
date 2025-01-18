import express from "express";
import { AnyZodObject } from "zod";
import {
  signIn,
  signUp,
  signOut,
  getMe,
  updateMe,
  deleteMe,
  getActiveSessions,
  deleteSession,
  deleteAllSessions,
} from "../controllers/auth.controller";
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
router.put("/update-me", withAuth, tryCatch(updateMe));
router.delete("/delete-me", withAuth, tryCatch(deleteMe));
router.get("/get-active-sessions", withAuth, tryCatch(getActiveSessions));
router.delete("/delete-session/:id", withAuth, tryCatch(deleteSession));
router.delete("/delete-all-sessions", withAuth, tryCatch(deleteAllSessions));

export { router as authRouter };
