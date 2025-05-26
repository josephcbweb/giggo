// app/api/reviews/route.ts
import { NextResponse } from "next/server";
import { connectMongoDB } from "@/lib/mongodb";
import { Review } from "@/models/Review";
import { auth } from "@/auth";
import { User } from "@/models/User";
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
  
      const body = await request.json();
      const { employerId, rating, text } = body;
  
      console.log("Received review data:", body); // Add logging
  
      // Validate required fields
      if (!employerId) {
        return NextResponse.json(
          { error: "Employer ID is required" },
          { status: 400 }
        );
      }
  
      if (!rating || isNaN(rating)) {
        return NextResponse.json(
          { error: "Valid rating is required" },
          { status: 400 }
        );
      }
  
      // Check if employer exists (now as a User)
      const employer = await User.findById(employerId);
      if (!employer) {
        return NextResponse.json(
          { error: "Employer not found" },
          { status: 404 }
        );
      }
  
      // Check if user is trying to review themselves
      if (session.user.id === employerId) {
        return NextResponse.json(
          { error: "You cannot review yourself" },
          { status: 400 }
        );
      }
  
      // Create new review
      const newReview = await Review.create({
        user: session.user.id,
        employer: employerId,
        rating: Number(rating),
        text: text || "",
      });
  
      // Update employer's rating stats
      const allReviews = await Review.find({ employer: employerId });
      const totalRating = allReviews.reduce((sum, review) => sum + review.rating, 0);
      
      employer.rating = totalRating / allReviews.length;
      employer.completedJobs = allReviews.length; // Or use reviewCount if you prefer
      await employer.save();
  
      return NextResponse.json(
        { 
          success: true,
          message: "Review submitted successfully", 
          review: newReview 
        },
        { status: 201 }
      );
  
    } catch (error) {
      console.error("Error submitting review:", error);
      return NextResponse.json(
        { 
          success: false,
          error: "Failed to submit review",
          details: error instanceof Error ? error.message : String(error)
        },
        { status: 500 }
      );
    }
  }

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

    const reviews = await Review.find({ employer: employerId })
      .populate("user", "name image")
      .sort({ createdAt: -1 });

    return NextResponse.json(reviews);

  } catch (error) {
    console.error("Error fetching reviews:", error);
    return NextResponse.json(
      { error: "Failed to fetch reviews" },
      { status: 500 }
    );
  }
}