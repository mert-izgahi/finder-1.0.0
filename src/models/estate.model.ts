import mongoose, { Document } from "mongoose";
import {
  EstateCategory,
  EstateType,
  EstateCondition,
  EstateStatus,
  EstateAmenity,
  EstateRentPeriod,
} from "../lib/enums";
import ReviewModel from "./review.model";

export interface IEstateDocument extends Document {
  user: mongoose.Schema.Types.ObjectId;
  category: EstateCategory;
  type: EstateType;
  condition: EstateCondition;
  status: EstateStatus;
  title: string;
  description: string;
  price: number;
  images: string[];
  videoUrl?: string;
  floorPlanUrl?: string;
  totalFloors?: number;
  floorNumber?: number;
  bedrooms?: number;
  bathrooms?: number;
  area?: number;
  yearBuilt?: number;
  priceNegotiable?: boolean;
  rentPeriod?: EstateRentPeriod;
  amenities: EstateAmenity[];
  views?: number;
  openToVisitors?: boolean;
  // LOCATION
  location: {
    type: string;
    coordinates: [number, number];
    city: string;
    state: string;
    country: string;
    postalCode: string;
    formattedAddress: string;
  };
  // REVIEWS
  averageRating?: number;
  reviewsCount?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface IEstateModel extends mongoose.Model<IEstateDocument> {
  findByIdAndUpdateRatingStats(id: string): Promise<IEstateDocument>;
}

const estateSchema = new mongoose.Schema<IEstateDocument, IEstateModel>(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    category: {
      type: String,
      required: true,
      enum: Object.values(EstateCategory),
    },
    type: {
      type: String,
      required: true,
      enum: Object.values(EstateType),
    },
    condition: {
      type: String,
      required: true,
      enum: Object.values(EstateCondition),
    },
    status: {
      type: String,
      required: true,
      enum: Object.values(EstateStatus),
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    images: {
      type: [String],
      required: true,
    },
    videoUrl: {
      type: String,
    },
    floorPlanUrl: {
      type: String,
    },
    totalFloors: {
      type: Number,
    },
    floorNumber: {
      type: Number,
    },
    bedrooms: {
      type: Number,
    },
    bathrooms: {
      type: Number,
    },
    area: {
      type: Number,
    },
    yearBuilt: {
      type: Number,
    },
    amenities: {
      type: [String],
      required: true,
      enum: Object.values(EstateAmenity),
    },
    priceNegotiable: {
      type: Boolean,
    },
    rentPeriod: {
      type: String,
      enum: Object.values(EstateRentPeriod),
      default: EstateRentPeriod.MONTHLY,
    },
    views: {
      type: Number,
      default: 0,
    },
    openToVisitors: {
      type: Boolean,
      default: true,
    },
    // LOCATION
    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: [Number],
      city: {
        type: String,
        required: true,
      },
      state: {
        type: String,
        required: true,
      },
      country: {
        type: String,
        required: true,
      },
    },
    // REVIEWS
    averageRating: {
      type: Number,
      default: 3,
    },
    reviewsCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

estateSchema.index({ location: "2dsphere" });

estateSchema.virtual("reviews", {
  ref: "Review",
  localField: "_id",
  foreignField: "estate",
});

estateSchema.statics.findByIdAndUpdateRatingStats = async function (
  id: string
) {
  const estate = await this.findById(id);
  if (!estate) {
    throw new Error("Estate not found");
  }
  const reviews = await ReviewModel.find({ estate: id });
  const totalRating = reviews.reduce((acc, review) => acc + review.rating, 0);
  const averageRating = totalRating / reviews.length;
  await this.updateOne(
    { _id: id },
    { averageRating, reviewsCount: reviews.length }
  );
  return this.findById(id);
};

export const EstateModel = mongoose.model<IEstateDocument, IEstateModel>(
  "Estate",
  estateSchema
);

export default EstateModel;
