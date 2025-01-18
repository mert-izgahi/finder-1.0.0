import mongoose, { Document } from "mongoose";

export interface ISessionDocument extends Document {
  user: mongoose.Schema.Types.ObjectId;
  valid: boolean;
  userAgent: string;
  createdAt: Date;
  updatedAt: Date;
}

const sessionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    valid: {
      type: Boolean,
      default: true,
    },
    userAgent: {
      type: String,
    },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

const SessionModel = mongoose.model<ISessionDocument>(
  "Session",
  sessionSchema
);

export default SessionModel;
