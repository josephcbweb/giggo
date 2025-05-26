import { connectMongoDB } from "@/lib/mongodb";
import { Application } from "@/models/Application";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    await connectMongoDB();
    
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const jobId = searchParams.get("jobId");
    const status = searchParams.get("status");

    let query = {};
    if (userId) query = { ...query, user: userId };
    if (jobId) query = { ...query, job: jobId };
    if (status) query = { ...query, status };

    const applications = await Application.find(query)
    .populate("user")
    .populate({
      path: "job",
      populate: {
        path: "category",
        select: "name",
      },
    })
    .populate("job");

    return NextResponse.json(applications);
  } catch (error) {
    return NextResponse.json(
      { error: "Error fetching applications" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    await connectMongoDB();
    
    const body = await request.json();
    const { user, job, status = "pending" } = body;

    if (!user || !job) {
      return NextResponse.json(
        { error: "User and Job IDs are required" },
        { status: 400 }
      );
    }

    const existingApplication = await Application.findOne({ user, job });
    if (existingApplication) {
      return NextResponse.json(
        { error: "Application already exists" },
        { status: 409 }
      );
    }

    const newApplication = new Application({
      user,
      job,
      status
    });

    const savedApplication = await newApplication.save();
    return NextResponse.json(savedApplication, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Error creating application" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    await connectMongoDB();
    
    const body = await request.json();
    const { user, job, status } = body;

    if (!user || !job || !["pending", "approved", "rejected"].includes(status)) {
      return NextResponse.json(
        { error: "Valid user ID, job ID and status are required" },
        { status: 400 }
      );
    }

    const updatedApplication = await Application.findOneAndUpdate(
      { user, job },
      { status },
      { new: true }
    )
    .populate({
      path: "user",
      select: "name email image"
    })
    .populate({
      path: "job",
      populate: {
        path: "category",
        select: "name"
      }
    });

    if (!updatedApplication) {
      return NextResponse.json(
        { error: "Application not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedApplication);
  } catch (error) {
    console.error("Error updating application:", error);
    return NextResponse.json(
      { error: "Error updating application" },
      { status: 500 }
    );
  }
}