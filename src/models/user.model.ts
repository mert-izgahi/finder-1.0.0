import mongoose, { Document } from "mongoose";
import { generateToken } from "../lib/jwt";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { Role } from "../lib/enums";

export interface IUserDocument extends Document {
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  password?: string;
  phoneNumber?: string;
  imageUrl?: string;
  about?: string;
  isActive?: boolean;
  isVerified?: boolean;
  isDeleted?: boolean;
  verificationToken?: string;
  verificationTokenExpiresAt?: Date;
  passwordResetToken?: string;
  passwordResetTokenExpiresAt?: Date;
  birthday?: Date;
  rating?: number;
  reviewsCount?: number;

  createdAt: Date;
  updatedAt: Date;

  comparePassword(password: string): Promise<boolean>;
  generateJWT(): Promise<string>;
  generatePasswordResetToken(): string;
  generateVerificationToken(): string;
}

export interface IUserModel extends mongoose.Model<IUserDocument> {
  findByEmail(email: string): Promise<IUserDocument | null>;
  findByCredentials(
    email: string,
    password: string
  ): Promise<IUserDocument | null>;
  findByIdAndSoftDelete(id: string): Promise<IUserDocument | null>;
  findByVerificationToken(token: string): Promise<IUserDocument | null>;
  findByPasswordResetToken(token: string): Promise<IUserDocument | null>;
}

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    role: {
      type: String,
      required: true,
      enum: Object.values(Role),
      default: Role.USER,
    },
    password: {
      type: String,
    },
    phoneNumber: {
      type: String,
    },
    imageUrl: {
      type: String,
    },
    about: {
      type: String,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    verificationToken: {
      type: String,
    },
    verificationTokenExpiresAt: {
      type: Date,
    },
    passwordResetToken: {
      type: String,
    },
    passwordResetTokenExpiresAt: {
      type: Date,
    },
    birthday: {
      type: Date,
    },
    rating: {
      type: Number,
      default: 0,
    },
    reviewsCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
    toObject: {
      virtuals: true,
    },
  }
);

userSchema.pre("save", async function (next) {
  if (!this.password) return next();

  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

userSchema.methods.comparePassword = async function (
  password: string
): Promise<boolean> {
  return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateJWT = async function (): Promise<string> {
  const token = await generateToken(this._id);
  return token;
};

userSchema.methods.generatePasswordResetToken = function (): string {
  const resetToken = crypto.randomBytes(32).toString("hex");
  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  this.passwordResetTokenExpiresAt = Date.now() + 10 * 60 * 1000;
  return resetToken;
};

userSchema.methods.generateVerificationToken = function (): string {
  const verificationToken = crypto.randomBytes(32).toString("hex");
  this.verificationToken = crypto
    .createHash("sha256")
    .update(verificationToken)
    .digest("hex");
  this.verificationTokenExpiresAt = Date.now() + 10 * 60 * 1000;
  return verificationToken;
};

userSchema.statics.findByEmail = async function (email: string) {
  return await this.findOne({ email });
};

userSchema.statics.findByCredentials = async function (
  email: string,
  password: string
) {
  const user = await this.findOne({ email, isDeleted: false });
  if (!user) return null;

  const isPasswordValid = await user.comparePassword(password);
  if (!isPasswordValid) return null;

  return user;
};

userSchema.statics.findByVerificationToken = async function (token: string) {
  const user = await this.findOne({ verificationToken: token });
  if (!user) return null;

  return user;
};

userSchema.statics.findByPasswordResetToken = async function (token: string) {
  const user = await this.findOne({ passwordResetToken: token });
  if (!user) return null;

  return user;
};

userSchema.statics.findByIdAndSoftDelete = async function (id: string) {
  const user = await this.findById(id);
  if (!user) return null;

  user.isDeleted = true;
  await user.save();

  return user;
};

const UserModel = mongoose.model<IUserDocument, IUserModel>("User", userSchema);

export default UserModel;
