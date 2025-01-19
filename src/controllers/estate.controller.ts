import { Request, Response } from "express";
import EstateModel from "../models/estate.model";
import { IResponse } from "../lib/types";
import { ApiError } from "../lib/api-error";

const createQueryObject = (
  req: Request
): {
  queryObject: Record<string, any>;
  page: number;
  limit: number;
  skip: number;
  sortBy: string;
  sortOrder: number;
} => {
  const queryObject: Record<string, any> = {};
  const page = req.query.page ? Math.max(Number(req.query.page), 1) : 1;
  const limit = req.query.limit ? Math.max(Number(req.query.limit), 1) : 10;
  const skip = (page - 1) * limit;
  const sortBy = req.query.sortBy ? String(req.query.sortBy) : "-createdAt";
  const sortOrder = sortBy.startsWith("-") ? -1 : 1;

  if (req.query.search) {
    queryObject.title = { $regex: req.query.search, $options: "i" };
  }

  if (req.query.minPrice || req.query.maxPrice) {
    queryObject.price = {};
    if (req.query.minPrice) {
      queryObject.price.$gte = Number(req.query.minPrice);
    }
    if (req.query.maxPrice) {
      queryObject.price.$lte = Number(req.query.maxPrice);
    }
  }

  if (req.query.category) {
    queryObject.category = String(req.query.category);
  }

  if (req.query.type) {
    queryObject.type = String(req.query.type);
  }

  if (req.query.condition) {
    queryObject.condition = String(req.query.condition);
  }

  if (req.query.status) {
    queryObject.status = String(req.query.status);
  }

  if (req.query.rentPeriod) {
    queryObject.rentPeriod = String(req.query.rentPeriod);
  }

  if (req.query.amenities) {
    queryObject.amenities = {
      $in: String(req.query.amenities).split("-"),
    };
  }

  if (req.query.openToVisitors === "true") {
    queryObject.openToVisitors = true;
  }

  return {
    queryObject,
    page,
    limit,
    skip,
    sortBy: sortBy.startsWith("-") ? sortBy.slice(1) : sortBy,
    sortOrder,
  };
};

export const getEstates = async (req: Request, res: Response) => {
  // Create Query Object
  const { queryObject, skip, page, limit, sortBy, sortOrder } =
    createQueryObject(req);

  console.log("Query Object:", queryObject);

  // Find Estates
  const estates = await EstateModel.find(queryObject)
    .populate({
      path: "user",
      select: "firstName lastName email rating reviewsCount imageUrl",
    })
    .skip(skip)
    .limit(limit)
    .sort({ [sortBy]: sortOrder === 1 ? 1 : -1 });

  // Pagination
  const totalResultCount = await EstateModel.countDocuments(queryObject);
  const totalPages = Math.ceil(totalResultCount / limit);
  const hasNextPage = page < totalPages;
  const hasPreviousPage = page > 1;

  const pagination = {
    page,
    limit,
    hasNextPage,
    hasPreviousPage,
    totalPages,
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

export const getMyEstates = async (req: Request, res: Response) => {
  const { currentUserId } = res.locals;
  const { page, limit, skip, sortBy, sortOrder, queryObject } =
    createQueryObject(req);
  const estates = await EstateModel.find({
    user: currentUserId,
    ...queryObject,
  })
    .skip(skip)
    .limit(limit)
    .sort({ [sortBy]: sortOrder === 1 ? 1 : -1 });

  const totalResultCount = await EstateModel.countDocuments({
    user: currentUserId,
    ...queryObject,
  });
  const totalPages = Math.ceil(totalResultCount / limit);
  const hasNextPage = page < totalPages;
  const hasPreviousPage = page > 1;

  const pagination = {
    page,
    limit,
    hasNextPage,
    hasPreviousPage,
    totalPages,
  };

  const response: IResponse = {
    status: 200,
    message: "My estates fetched successfully",
    data: {
      estates,
      pagination,
    },
  };
  return res.status(200).json(response);
};

export const getTopViewedEstatesBy = async (req: Request, res: Response) => {
  const { by } = req.params;
  const stats = await EstateModel.aggregate([
    {
      $sort: { views: -1 },
    },
    {
      $group: {
        _id: `$${by}`,
        count: { $sum: 1 },
      },
    },
    {
      $limit: 3,
    },
    {
      $project: {
        _id: 0,
        [by]: "$_id",
        count: 1,
      },
    },
  ]);

  const response: IResponse = {
    status: 200,
    message: "Top estates fetched successfully",
    data: stats,
  };
  return res.status(200).json(response);
};
