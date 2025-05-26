// app/api/employer/stats/route.ts
import { NextResponse } from "next/server";
import { connectMongoDB } from "@/lib/mongodb";
import { Employer } from "@/models/Employer";
import { Review } from "@/models/Review";
import { Job } from "@/models/Job";
import mongoose from "mongoose";

export async function GET(request: Request) {
  try {
    await connectMongoDB();
    const { searchParams } = new URL(request.url);
    const employerId = searchParams.get("employerId");

    if (!employerId) {
      return NextResponse.json(
        { error: "Employer ID is required" },
        { status: 400 }
      );
    }

    const employer = await Employer.findById(employerId);
    if (!employer) {
      return NextResponse.json(
        { error: "Employer not found" },
        { status: 404 }
      );
    }

    const [reviews, jobs] = await Promise.all([
      Review.find({ employer: employerId }).countDocuments(),
      Job.find({ createdBy: employer.user }).countDocuments(),
    ]);

    return NextResponse.json({
      averageRating: employer.averageRating,
      reviewCount: reviews,
      jobCount: jobs,
      ratingDistribution: await getRatingDistribution(employerId)
    });

  } catch (error) {
    console.error("Error fetching employer stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch employer stats" },
      { status: 500 }
    );
  }
}

async function getRatingDistribution(employerId: string) {
  const result = await Review.aggregate([
    { $match: { employer: new mongoose.Types.ObjectId(employerId) } },
    {
      $group: {
        _id: "$rating",
        count: { $sum: 1 }
      }
    },
    { $sort: { _id: 1 } }
  ]);

  // Convert to a map of rating -> count
  const distribution = Array(5).fill(0);
  result.forEach(item => {
    distribution[item._id - 1] = item.count;
  });

  return distribution;
}