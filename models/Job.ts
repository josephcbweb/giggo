// models/Job.ts
import mongoose, { Schema, Document } from "mongoose";

export interface IJob extends Document {
  title: string;
  description: string;
  pay: number;
  location: { // Ensure this matches POST request
    address: string;
    coordinates?: { lat: number; lng: number };
    placeId?: string;
  };
  duration: string;
  category: mongoose.Types.ObjectId;
  imageLink?: string;
  createdBy: mongoose.Types.ObjectId;
  startDate: Date;
  isActive?: boolean;
}

const JobSchema = new Schema<IJob>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    pay: { type: Number, required: true },
    location: { // Must match the interface
      address: { type: String, required: true },
      coordinates: {
        lat: { type: Number },
        lng: { type: Number },
      },
      placeId: { type: String },
    },
    duration: { type: String, required: true },
    category: { type: Schema.Types.ObjectId, ref: "Category", required: true },
    imageLink: { type: String },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    startDate: { type: Date, required: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

// Clear existing model if it exists
if (mongoose.models.Job) {
  mongoose.deleteModel('Job');
}

export const Job = mongoose.model<IJob>("Job", JobSchema);