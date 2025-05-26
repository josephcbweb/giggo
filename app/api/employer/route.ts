// app/api/employer/route.ts
import { NextResponse } from "next/server";
import { connectMongoDB } from "@/lib/mongodb";
import { Employer } from "@/models/Employer";
import { Review } from "@/models/Review";
import { auth } from "@/auth";

export async function GET(request: Request) {
  try {
    await connectMongoDB();
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    const employer = await Employer.findOne({ user: userId })
      .populate("user", "name email image");

    if (!employer) {
      return NextResponse.json(
        { error: "Employer not found" },
        { status: 404 }
      );
    }

    // Get recent reviews
    const reviews = await Review.find({ employer: employer._id })
      .populate("user", "name image")
      .sort({ createdAt: -1 })
      .limit(3);

    return NextResponse.json({
      ...employer.toObject(),
      recentReviews: reviews
    });

  } catch (error) {
    console.error("Error fetching employer:", error);
    return NextResponse.json(
      { error: "Failed to fetch employer" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    await connectMongoDB();
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const userId = session.user.id;
    let employer = await Employer.findOne({ user: userId });

    if (employer) {
      // Update existing employer
      employer.jobCount += 1;
    } else {
      // Create new employer
      employer = new Employer({
        user: userId,
        averageRating: 0,
        jobCount: 1,
        reviewCount: 0
      });
    }

    await employer.save();

    return NextResponse.json({
      message: "Employer record updated successfully",
      employer
    }, { status: 200 });

  } catch (error) {
    console.error("Error creating/updating employer:", error);
    return NextResponse.json(
      { error: "Failed to update employer record" },
      { status: 500 }
    );
  }
}