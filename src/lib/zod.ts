import { z, TypeOf } from "zod";
import {
  EstateCategory,
  EstateType,
  EstateCondition,
  EstateStatus,
  EstateAmenity,
  EstateRentPeriod,
} from "./enums";

export const signUpSchema = z
  .object({
    firstName: z.string().min(2, "First name must be at least 2 characters"),
    lastName: z.string().min(2, "Last name must be at least 2 characters"),
    email: z.string().email("Invalid email"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z
      .string()
      .min(6, "Password must be at least 6 characters"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const signInSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const estateSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters"),
  description: z
    .string()
    .min(2, "Description must be at least 2 characters")
    .max(1000, "Description must be at most 1000 characters"),
  category: z.nativeEnum(EstateCategory),
  type: z.nativeEnum(EstateType),
  condition: z.nativeEnum(EstateCondition),
  status: z.nativeEnum(EstateStatus),
  amenities: z.array(z.nativeEnum(EstateAmenity)),
  rentPeriod: z.nativeEnum(EstateRentPeriod),
  price: z.number().min(0, "Price must be at least 0"),
  location: z.string().min(2, "Location must be at least 2 characters"),
  images: z.array(z.string()).min(1, "At least one image is required"),
  videoUrl: z.string().optional(),
  floorPlanUrl: z.string().optional(),
  totalFloors: z.number().min(0, "Total floors must be at least 0"),
  floorNumber: z.number().min(0, "Floor number must be at least 0"),
  bedrooms: z.number().min(0, "Bedrooms must be at least 0"),
  bathrooms: z.number().min(0, "Bathrooms must be at least 0"),
  area: z.number().min(0, "Area must be at least 0"),
  yearBuilt: z.number().min(0, "Year built must be at least 0"),
  priceNegotiable: z.boolean(),
  openToVisitors: z.boolean(),
});

export type SignUpSchema = TypeOf<typeof signUpSchema>;
export type SignInSchema = TypeOf<typeof signInSchema>;
export type EstateSchema = TypeOf<typeof estateSchema>;
