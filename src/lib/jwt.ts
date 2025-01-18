import jwt from "jsonwebtoken";
import { ApiError } from "./api-error";
export const generateToken = (id: string) => {
  return jwt.sign({ id }, process.env.JWT_SECRET as string, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

export const verifyToken = (token: string) => {
  const decoded = jwt.verify(token, process.env.JWT_SECRET as string, (err: any) => {
    if (err) {
      throw new ApiError(401, "Invalid token", "Unauthorized");
    }
    return decoded;
  });

  return decoded;
};


