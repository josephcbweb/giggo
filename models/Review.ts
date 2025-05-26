import mongoose, { Schema, Document } from "mongoose";
import { IUser } from "./User";
import { IEmployer } from "./Employer";

export interface IReview extends Document {
  user: IUser["_id"];
  employer: IEmployer["_id"];
  rating: number;
  text?: string;
}

const ReviewSchema = new Schema<IReview>(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    employer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employer",
      required: true,
    },
    rating: { type: Number, required: true },
    text: { type: String },
  },
  { timestamps: true }
);

export const Review =
  mongoose.models.Review || mongoose.model<IReview>("Review", ReviewSchema);
