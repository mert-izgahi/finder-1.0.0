import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import configs from "../configs";
import { ApiError } from "../lib/api-error";
import SessionModel from "../models/session.model";
import UserModel from "../models/user.model";

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { token } = req?.cookies;

  if (!token) {
    return next();
  }

  const decoded = jwt.verify(token, configs.jwtSecret!);

  if (!decoded) {
    return next();
  }
  const user = await UserModel.findById((decoded as any).id);
  if (!user) {
    return next();
  }
  const session = await SessionModel.findOne({
    user: (decoded as any).id,
    valid: true,
  });

  if (!session) {
    return next();
  }

  const currentUserId = user._id;
  const currentUserRole = user.role;
  const currentSessionId = session._id;
  console.log({
    currentUserId,
    currentUserRole,
    currentSessionId,
  });

  if (!currentUserId) {
    return next();
  }
  if (!currentUserRole) {
    return next();
  }
  if (!currentSessionId) {
    return next();
  }
  res.locals.currentUserId = currentUserId;
  res.locals.currentUserRole = currentUserRole;
  res.locals.currentSessionId = currentSessionId;

  return next();
};

export const withAuth = (req: Request, res: Response, next: NextFunction) => {
  const { currentUserId } = res.locals;

  if (!currentUserId) {
    return next(ApiError.invalidCredentials());
  }

  return next();
};

export const authorizedFor = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { currentUserRole } = res.locals;
    if (!currentUserRole) {
      return next(ApiError.invalidCredentials());
    }

    if (!roles.includes(currentUserRole)) {
      return next(ApiError.invalidCredentials());
    }

    return next();
  };
};
