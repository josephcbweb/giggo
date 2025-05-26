// models/Employer.ts
import mongoose, { Schema, Document } from "mongoose";
import { IUser } from "./User";

export interface IEmployer extends Document {
  user: IUser["_id"];
  averageRating: number;
  jobCount: number;
  reviewCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const EmployerSchema = new Schema<IEmployer>(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    averageRating: { type: Number, default: 0, min: 0, max: 5 },
    jobCount: { type: Number, default: 0 },
    reviewCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// Add index for better query performance
EmployerSchema.index({ user: 1 });

export const Employer =
  mongoose.models.Employer ||
  mongoose.model<IEmployer>("Employer", EmployerSchema);