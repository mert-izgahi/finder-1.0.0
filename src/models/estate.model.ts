import mongoose, { Document } from "mongoose";
import {
  EstateCategory,
  EstateType,
  EstateCondition,
  EstateStatus,
  EstateAmenity,
  EstateRentPeriod,
} from "../lib/enums";

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
  createdAt: Date;
  updatedAt: Date;
}

const estateSchema = new mongoose.Schema(
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
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

estateSchema.index({ location: "2dsphere" });

export const EstateModel = mongoose.model<IEstateDocument>(
  "Estate",
  estateSchema
);

export default EstateModel;
