import { Request, Response } from "express";
import { ApiError } from "../lib/api-error";
import UserModel from "../models/user.model";
import SessionModel from "../models/session.model";

export const signUp = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const existingUser = await UserModel.findByEmail(email);
  if (existingUser) return res.status(409).json(ApiError.duplicatedEmail());

  const user = await UserModel.create({ ...req.body });

  // Create Session
  await SessionModel.create({
    user: user._id,
    userAgent: req.headers["user-agent"],
  });

  const token = await user.generateJWT();

  return res
    .status(201)
    .cookie("token", token, { httpOnly: true, secure: true, sameSite: "none" })
    .json(user);
};

export const signIn = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const user = await UserModel.findByCredentials(email, password);
  if (!user) return res.status(401).json(ApiError.invalidCredentials());

  // Create Session
  await SessionModel.create({
    user: user._id,
    userAgent: req.headers["user-agent"],
  });

  const token = await user.generateJWT();
  return res
    .status(200)
    .cookie("token", token, { httpOnly: true, secure: true, sameSite: "none" })
    .json(user);
};

export const signOut = async (req: Request, res: Response) => {
  const { currentSessionId } = res.locals;
  await SessionModel.updateOne({ _id: currentSessionId }, { valid: false });
  return res
    .status(200)
    .clearCookie("token", { httpOnly: true, secure: true, sameSite: "none" })
    .json({ message: "Signed out successfully" });
};

export const getMe = async (req: Request, res: Response) => {
  const { currentUserId } = res.locals;
  const user = await UserModel.findById(currentUserId);
  if (!user) return res.status(404).json(ApiError.notFound());

  return res.status(200).json(user);
};
