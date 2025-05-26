import { connectMongoDB } from "@/lib/mongodb";
import { Category } from "@/models/Category";
import { NextResponse } from "next/server";

export async function GET() {
  await connectMongoDB();

  try {
    const categories = await Category.find({});
    return NextResponse.json(categories, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Error fetching categories." },
      { status: 500 }
    );
  }
}
