import { Request, Response } from "express";
import { ApiError } from "../lib/api-error";
import UserModel from "../models/user.model";
import SessionModel from "../models/session.model";
import { IResponse } from "../lib/types";

export const signUp = async (req: Request, res: Response) => {
  const { email } = req.body;
  const existingUser = await UserModel.findByEmail(email);
  if (existingUser) return res.status(409).json(ApiError.duplicatedEmail());

  const user = await UserModel.create({ ...req.body });

  // Create Session
  await SessionModel.create({
    user: user._id,
    userAgent: req.headers["user-agent"],
  });

  const token = await user.generateJWT();
  const response: IResponse = {
    status: 201,
    message: "User created successfully",
    data: user,
  };
  return res
    .status(201)
    .cookie("token", token, { httpOnly: true, secure: true, sameSite: "none" })
    .json(response);
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
  const response: IResponse = {
    status: 200,
    message: "Signed in successfully",
    data: user,
  };
  return res
    .status(200)
    .cookie("token", token, { httpOnly: true, secure: true, sameSite: "none" })
    .json(response);
};

export const signOut = async (req: Request, res: Response) => {
  const { currentSessionId } = res.locals;
  await SessionModel.updateOne({ _id: currentSessionId }, { valid: false });
  const response: IResponse = {
    status: 200,
    message: "Signed out successfully",
    data: null,
  };
  return res
    .status(200)
    .clearCookie("token", { httpOnly: true, secure: true, sameSite: "none" })
    .json(response);
};

export const getMe = async (req: Request, res: Response) => {
  const { currentUserId } = res.locals;
  const user = await UserModel.findById(currentUserId);
  if (!user) return res.status(404).json(ApiError.notFound());
  const response: IResponse = {
    status: 200,
    message: "User fetched successfully",
    data: user,
  };
  return res.status(200).json(response);
};

export const updateMe = async (req: Request, res: Response) => {
  const { currentUserId } = res.locals;
  const user = await UserModel.findByIdAndUpdate(currentUserId, req.body, {
    new: true,
  });
  if (!user) return res.status(404).json(ApiError.notFound());
  const response: IResponse = {
    status: 200,
    message: "User updated successfully",
    data: user,
  };
  return res.status(200).json(response);
};

export const deleteMe = async (req: Request, res: Response) => {
  const { currentUserId } = res.locals;
  await UserModel.findByIdAndSoftDelete(currentUserId);
  await SessionModel.deleteMany({ user: currentUserId });
  const response: IResponse = {
    status: 200,
    message: "User deleted successfully",
    data: null,
  };
  return res.status(200).json(response);
};

export const getActiveSessions = async (req: Request, res: Response) => {
  const { currentUserId } = res.locals;
  const sessions = await SessionModel.find({
    user: currentUserId,
    valid: true,
  });
  const response: IResponse = {
    status: 200,
    message: "Active sessions fetched successfully",
    data: sessions,
  };
  return res.status(200).json(response);
};

export const deleteSession = async (req: Request, res: Response) => {
  const { id } = req.params;
  await SessionModel.updateOne({ _id: id }, { valid: false });
  const response: IResponse = {
    status: 200,
    message: "Session deleted successfully",
    data: null,
  };
  return res.status(200).json(response);
};

export const deleteAllSessions = async (req: Request, res: Response) => {
  const { currentUserId } = res.locals;
  await SessionModel.deleteMany({ user: currentUserId });
  const response: IResponse = {
    status: 200,
    message: "All sessions deleted successfully",
    data: null,
  };
  return res.status(200).json(response);
};
