import { Request, Response } from "express";
import { IResponse } from "../lib/types";
import ReviewModel from "../models/review.model";
import EstateModel from "../models/estate.model";

export const createReview = async (req: Request, res: Response) => {
  const { currentUserId } = res.locals;
  const { estateId } = req.params;
  const { rating, comment } = req.body;

  const review = await ReviewModel.create({
    user: currentUserId,
    estate: estateId,
    rating,
    comment,
  });

  // Update average rating and reviews count
  await EstateModel.findByIdAndUpdateRatingStats(estateId);

  const response: IResponse = {
    status: 200,
    message: "Review created successfully",
    data: review,
  };
  return res.status(200).json(response);
};

export const deleteReview = async (req: Request, res: Response) => {
  const { id } = req.params;
  const review = await ReviewModel.findOne({ _id: id });
  if (!review) {
    return res
      .status(404)
      .json({ message: "Review not found", title: "NotFound" });
  }

  await ReviewModel.deleteOne({ _id: id });
  await EstateModel.findByIdAndUpdateRatingStats(review.estate);

  const response: IResponse = {
    status: 200,
    message: "Review deleted successfully",
    data: null,
  };
  return res.status(200).json(response);
};

export const updateReview = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { rating, comment } = req.body;
  const review = await ReviewModel.findOne({ _id: id });
  if (!review) {
    return res
      .status(404)
      .json({ message: "Review not found", title: "NotFound" });
  }

  await ReviewModel.updateOne({ _id: id }, { rating, comment });

  // Update average rating and reviews count
  await EstateModel.findByIdAndUpdateRatingStats(review.estate);

  const response: IResponse = {
    status: 200,
    message: "Review updated successfully",
    data: null,
  };
  return res.status(200).json(response);
};

export const getCreatedReviews = async (req: Request, res: Response) => {
  const { currentUserId } = res.locals;
  const reviews = await ReviewModel.find({ user: currentUserId });
  const response: IResponse = {
    status: 200,
    message: "My reviews fetched successfully",
    data: reviews,
  };
  return res.status(200).json(response);
};

export const getRecievedReviews = async (req: Request, res: Response) => {
  const { currentUserId } = res.locals;

  const estates = await EstateModel.find({ user: currentUserId });
  const reviews = await ReviewModel.find({
    estate: { $in: estates.map((estate) => estate._id) },
  });
  const response: IResponse = {
    status: 200,
    message: "My reviews fetched successfully",
    data: reviews,
  };
  return res.status(200).json(response);
};
