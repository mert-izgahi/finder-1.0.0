import { randomEstates } from "../lib/faker";
import { Request, Response } from "express";
import EstateModel from "../models/estate.model";
import { IResponse } from "../lib/types";

export const seedEstates = async (req: Request, res: Response) => {
  await EstateModel.deleteMany({});
  const { currentUserId } = res.locals;
  const estates = await EstateModel.insertMany(
    randomEstates.map((estate) => ({ ...estate, user: currentUserId }))
  );
  const response: IResponse = {
    status: 201,
    message: "Estate created successfully",
    data: estates,
  };
  return res.status(201).json(response);
};
