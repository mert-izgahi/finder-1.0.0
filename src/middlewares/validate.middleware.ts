import { AnyZodObject } from "zod";
import { Request, Response, NextFunction } from "express";

export const validate = (schema: AnyZodObject) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
      res.status(400).json({ error });
    }
  };
};
