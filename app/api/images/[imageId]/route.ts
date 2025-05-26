// app/api/images/[imageId]/route.ts
import { NextResponse } from "next/server";
import { getImageFromGridFS } from "@/lib/gridfs";
import { connectMongoDB } from "@/lib/mongodb";

export async function GET(
  request: Request,
  { params }: { params: { imageId: string } }
) {
  try {
    await connectMongoDB();
    const { imageId } = params;

    // Get raw image buffer from GridFS
    const imageBuffer = await getImageFromGridFS(imageId);

    // Return as binary response with proper content type
    return new NextResponse(imageBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'image/jpeg', // or detect actual type
        'Cache-Control': 'public, max-age=31536000, immutable'
      }
    });
    
  } catch (error: any) {
    console.error("Error fetching image:", error);
    return NextResponse.json(
      { message: error.message || "Error fetching image" },
      { status: 404 }
    );
  }
}