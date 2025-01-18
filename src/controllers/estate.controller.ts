import { Request, Response } from "express";
import EstateModel from "../models/estate.model";
import { IResponse } from "../lib/types";
import { ApiError } from "../lib/api-error";

const createQueryObject = (req: Request) => {
  const queryObject = {} as Record<string, any>;

  if (req.query.search) {
    queryObject.title = { $regex: req.query.search, $options: "i" };
  }

  if (req.query.minPrice) {
    queryObject.price = { $gte: Number(req.query.minPrice) };
  }

  if (req.query.maxPrice) {
    queryObject.price = {
      ...queryObject.price,
      $lte: Number(req.query.maxPrice),
    };
  }

  if (req.query.category) {
    queryObject.category = req.query.category;
  }

  if (req.query.type) {
    queryObject.type = req.query.type;
  }

  if (req.query.condition) {
    queryObject.condition = req.query.condition;
  }

  if (req.query.status) {
    queryObject.status = req.query.status;
  }

  if (req.query.rentPeriod) {
    queryObject.rentPeriod = req.query.rentPeriod;
  }

  if (req.query.amenities) {
    queryObject.amenities = {
      $in: (req.query.amenities as string).split("-"),
    };
  }

  if (req.query.openToVisitors) {
    queryObject.openToVisitors = true;
  }

  if (req.query.page) {
    const page = Number(req.query.page);
    const limit = Number(req.query.limit);
    const skip = (page - 1) * limit;
    queryObject.skip = skip;
    queryObject.limit = limit;
  }

  if (req.query.sortBy && req.query.sortBy !== "createdAt") {
    const sortByValue = req.query.sortBy as string;
    const sortOrder = sortByValue.startsWith("-") ? -1 : 1;
    const sortBy = sortByValue.replace("-", "");
    queryObject.sort = { [sortBy]: sortOrder };
  }

  return queryObject;
};

export const createEstate = async (req: Request, res: Response) => {
  const { currentUserId } = res.locals;
  const estate = await EstateModel.create({
    ...req.body,
    user: currentUserId,
  });
  const response: IResponse = {
    status: 201,
    message: "Estate created successfully",
    data: estate,
  };
  return res.status(201).json(response);
};

export const getEstates = async (req: Request, res: Response) => {
  // Create Query Object
  const queryObject = createQueryObject(req);

  // Find Estates
  const estates = await EstateModel.find(queryObject)
    .populate("user")
    .sort(queryObject.sort)
    .skip(queryObject.skip)
    .limit(queryObject.limit);

  // Pagination
  const totalEstates = await EstateModel.countDocuments(queryObject);
  const totatPages = Math.ceil(totalEstates / queryObject.limit);
  const hasNextPage = queryObject.page < totatPages;
  const hasPreviousPage = queryObject.page > 1;
  const pagination = {
    page: queryObject.page,
    limit: queryObject.limit,
    hasNextPage,
    hasPreviousPage,
    totatPages,
  };

  const response: IResponse = {
    status: 200,
    message: "Estates fetched successfully",
    data: {
      estates,
      pagination,
    },
  };
  return res.status(200).json(response);
};

export const getEstate = async (req: Request, res: Response) => {
  const { id } = req.params;
  const estate = await EstateModel.findById(id).populate("user");
  if (!estate) return res.status(404).json(ApiError.notFound());
  const response: IResponse = {
    status: 200,
    message: "Estate fetched successfully",
    data: estate,
  };
  return res.status(200).json(response);
};

export const updateEstate = async (req: Request, res: Response) => {
  const { id } = req.params;
  const estate = await EstateModel.findByIdAndUpdate(id, req.body, {
    new: true,
  });
  if (!estate) return res.status(404).json(ApiError.notFound());
  const response: IResponse = {
    status: 200,
    message: "Estate updated successfully",
    data: estate,
  };
  return res.status(200).json(response);
};

export const deleteEstate = async (req: Request, res: Response) => {
  const { id } = req.params;
  const estate = await EstateModel.findByIdAndDelete(id);
  if (!estate) return res.status(404).json(ApiError.notFound());
  const response: IResponse = {
    status: 200,
    message: "Estate deleted successfully",
    data: null,
  };
  return res.status(200).json(response);
};
