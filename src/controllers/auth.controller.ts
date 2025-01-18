import { Request, Response } from "express";
import { ApiError } from "../lib/api-error";
import { verifyToken } from "../lib/jwt";
import UserModel from "../models/user.model";

export const signUp = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const existingUser = await UserModel.findByEmail(email);
  if (existingUser) return res.status(409).json(ApiError.duplicatedEmail());

  const user = await UserModel.create({ ...req.body });
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

  const token = await user.generateJWT();
  return res
    .status(200)
    .cookie("token", token, { httpOnly: true, secure: true, sameSite: "none" })
    .json(user);
};

export const signOut = async (req: Request, res: Response) => {
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
