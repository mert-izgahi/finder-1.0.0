import mongoose, { Document } from "mongoose";

export interface ILocationDocument extends Document {
  latitude: number;
  longitude: number;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  formattedAddress: string;
  user?: mongoose.Schema.Types.ObjectId;
  listing?: mongoose.Schema.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}


const locationSchema = new mongoose.Schema(
  {
    latitude: {
      type: Number,
      required: true,
    },
    longitude: {
      type: Number,
      required: true,
    },
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
    postalCode: {
      type: String,
      required: true,
    },
    formattedAddress: {
      type: String,
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    listing: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Listing",
    },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

const LocationModel = mongoose.model<ILocationDocument>(
  "Location",
  locationSchema
);

export default LocationModel;