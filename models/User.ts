// models/User.ts
import mongoose, { Document, models, Schema } from "mongoose";
import { deleteImageFromGridFS } from "../lib/gridfs";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  imageUrl?: string; // URL from social auth
  imageId?: string; // GridFS file ID
  availability?: "Full-time" | "Part-time" | "Weekdays" | "Weekends" | "Flexible";
  preferredJobTypes?: string[];
  skills?: string[];
  phone: string;
  authProviderId: string;
  description?: string;
  location?: {
    address?: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
    placeId?: string;
  };
}

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
    },
    phone: {
      type: String,
    },
    imageUrl: {
      type: String,
    },
    imageId: {
      type: String,
    },
    authProviderId: {
      type: String,
    },
    description: {
      type: String,
      default: "",
    },
    location: {
      address: String,
      coordinates: {
        lat: Number,
        lng: Number
      },
      placeId: String,
    },
    availability: {
      type: String,
      enum: ["Full-time", "Part-time", "Weekdays", "Weekends", "Flexible"],
      default: "Flexible",
    },
    preferredJobTypes: {
      type: [String],
      default: [],
    },
    skills: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true }
);

userSchema.pre("deleteOne", { document: true }, async function (next) {
  if (this.imageId) {
    await deleteImageFromGridFS(this.imageId);
  }
  next();
});

export const User = models.User || mongoose.model<IUser>("User", userSchema);