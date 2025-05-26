import { NextResponse } from "next/server";
import { Job } from "@/models/Job";
import { connectMongoDB } from "@/lib/mongodb";
import { auth } from "@/auth";

export async function GET(request: Request) {
  await connectMongoDB();
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const isActive = searchParams.get("isActive") !== "false"; // default to true if not specified
    
    if (userId) {
      const jobs = await Job.find({ createdBy: userId, isActive })
        .populate("category")
        .populate("createdBy");
      return NextResponse.json(jobs, { status: 200 });
    } else {
      const jobs = await Job.find({ isActive })
        .populate("category")
        .populate("createdBy");
      return NextResponse.json(jobs, { status: 200 });
    }
  } catch (error) {
    return NextResponse.json(
      { error: "Error fetching jobs." },
      { status: 500 }
    );
  }
}

// app/api/gigs/route.ts
export async function POST(request: Request) {
  await connectMongoDB();
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  try {
    const body = await request.json();

    // Validate required fields
    if (!body.title || !body.description || !body.pay || !body.location?.address || !body.duration || !body.category || !body.startDate) {
      return NextResponse.json(
        { error: "Missing required fields." },
        { status: 400 }
      );
    }

    // Explicitly structure the location object
    const location = {
      address: body.location.address,
      coordinates: body.location.coordinates || undefined,
      placeId: body.location.placeId || undefined,
    };

    const newJob = await Job.create({
      ...body,
      location, // Use the properly structured object
      createdBy: session.user?.id,
      isActive: body.isActive !== false,
    });

    return NextResponse.json(newJob, { status: 201 });
  } catch (error) {
    console.error("Full error:", error);
    return NextResponse.json(
      {
        error: "Error creating job.",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}