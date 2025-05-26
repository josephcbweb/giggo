import { NextResponse } from "next/server";
import { connectMongoDB } from "@/lib/mongodb";
import { Job } from "@/models/Job";
import mongoose from "mongoose";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectMongoDB();
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { error: "Gig ID is required" },
        { status: 400 }
      );
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: "Invalid gig ID format" },
        { status: 400 }
      );
    }

    const gig = await Job.findById(id)
      .populate("createdBy", "-password") // Exclude sensitive fields
      .populate("category");

    if (!gig) {
      return NextResponse.json({ error: "Gig not found" }, { status: 404 });
    }

    return NextResponse.json(gig);
  } catch (error) {
    console.error("Error fetching gig:", error);
    return NextResponse.json(
      { error: "Failed to fetch gig", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectMongoDB();
    const { id } = await params;

    // Validate ID
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: "Invalid gig ID format" },
        { status: 400 }
      );
    }

    const body = await request.json();
    console.log("Received update payload:", body); // Log the incoming payload

    // Validate required fields
    if (!body || Object.keys(body).length === 0) {
      return NextResponse.json(
        { error: "No update data provided" },
        { status: 400 }
      );
    }

    // Prepare updates with validation
    const updates: Record<string, any> = {};
    
    // Handle location separately
    if (body.location) {
      if (typeof body.location !== 'object' || !body.location.address) {
        return NextResponse.json(
          { 
            error: "Invalid location format",
            details: "Location must be an object with at least an address field"
          },
          { status: 400 }
        );
      }
      
      updates.location = {
        address: body.location.address,
        coordinates: body.location.coordinates || undefined,
        placeId: body.location.placeId || undefined
      };
    }

    // Handle other fields
    const allowedFields = ['title', 'description', 'pay', 'duration', 'category', 'imageLink', 'startDate', 'isActive'];
    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        updates[field] = body[field];
      }
    }

    // Validate category if being updated
    if (updates.category && !mongoose.Types.ObjectId.isValid(updates.category)) {
      return NextResponse.json(
        { error: "Invalid category ID format" },
        { status: 400 }
      );
    }

    // Validate startDate if being updated
    if (updates.startDate && isNaN(new Date(updates.startDate).getTime())) {
      return NextResponse.json(
        { error: "Invalid start date format" },
        { status: 400 }
      );
    }

    console.log("Processed updates:", updates); // Log the processed updates

    const updatedGig = await Job.findByIdAndUpdate(
      id,
      updates,
      { 
        new: true,
        runValidators: true
      }
    ).populate("createdBy").populate("category");

    if (!updatedGig) {
      return NextResponse.json({ error: "Gig not found" }, { status: 404 });
    }

    return NextResponse.json(updatedGig);
  } catch (error) {
    console.error("Update error:", error);
    
    // Handle Mongoose validation errors
    if (error instanceof mongoose.Error.ValidationError) {
      const errors = Object.values(error.errors).map(err => err.message);
      return NextResponse.json(
        { 
          error: "Validation failed",
          details: errors 
        },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { 
        error: "Failed to update gig",
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}