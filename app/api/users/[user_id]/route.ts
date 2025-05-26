import { NextResponse } from "next/server";
import { connectMongoDB } from "@/lib/mongodb";
import { User } from "@/models/User";
import { uploadImageToGridFS, deleteImageFromGridFS } from "@/lib/gridfs";

// GET user by ID
export async function GET(request: Request, { params }: { params: Promise<{ user_id: string }> }) {
  try {
    await connectMongoDB();
    const { user_id: _id } = await params;

    if (!_id) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    const user = await User.findOne({ _id });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const userDetails = {
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      imageId: user.imageId,
      imageUrl: user.imageUrl,
      authProviderId: user.authProviderId,
      description: user.description,
      location: user.location || {
        address: "",
        coordinates: null,
        placeId: ""
      },
      availability: user.availability, 
      preferredJobTypes: user.preferredJobTypes,
      skills: user.skills,
      joinedDate: user.createdAt
        ? new Date(user.createdAt).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          })
        : null,
    };

    return NextResponse.json(userDetails);
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json(
      { error: "Failed to fetch user" },
      { status: 500 }
    );
  }
}

// PUT route to update user data
export async function PUT(request: Request, { params }: { params: Promise<{ user_id: string }> }) {
  try {
    await connectMongoDB();
    const { user_id: _id } = await params;

    if (!_id) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    // Get form data (can be JSON or FormData)
    let formData;
    const contentType = request.headers.get("content-type");
    
    if (contentType?.includes("multipart/form-data")) {
      formData = await request.formData();
    } else {
      formData = await request.json();
    }

    const user = await User.findById(_id);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    let imageId = user.imageId;
    if (formData instanceof FormData && formData.has("image")) {
      const imageFile = formData.get("image") as File;
      
      if (imageId) {
        await deleteImageFromGridFS(imageId);
      }
      const buffer = Buffer.from(await imageFile.arrayBuffer());
      imageId = await uploadImageToGridFS(buffer, imageFile.name);
    }

    // Handle location data
    let locationData;
    if (formData instanceof FormData) {
      const locationString = formData.get("location");
      locationData = locationString ? JSON.parse(locationString as string) : null;
    } else {
      locationData = formData.location;
    }

    // Prepare update data
    const updateData: any = {
      name: formData.get?.("name") || formData.name,
      phone: formData.get?.("phone") || formData.phone,
      description: formData.get?.("description") || formData.description,
      availability: formData.get?.("availability") || formData.availability,
      preferredJobTypes: JSON.parse(
        formData.get?.("preferredJobTypes") || 
        JSON.stringify(formData.preferredJobTypes || [])
      ),
      skills: JSON.parse(
        formData.get?.("skills") || 
        JSON.stringify(formData.skills || [])
      ),
    };

    // Update location data if it exists
    if (locationData) {
      updateData.location = {
        address: locationData.address || "",
        coordinates: locationData.coordinates || null,
        placeId: locationData.placeId || ""
      };
    }

    if (imageId) {
      updateData.imageId = imageId;
      updateData.imageUrl = "";
    }

    // Update user
    const updatedUser = await User.findByIdAndUpdate(
      _id,
      { $set: updateData },
      { new: true }
    );

    // Return the updated user details
    const userDetails = {
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      phone: updatedUser.phone,
      image: updatedUser.imageId 
        ? `${process.env.NEXTAUTH_URL}/api/images/${updatedUser.imageId}`
        : updatedUser.imageUrl,
      authProviderId: updatedUser.authProviderId,
      description: updatedUser.description,
      location: updatedUser.location || {
        address: "",
        coordinates: null,
        placeId: ""
      },
      availability: updatedUser.availability,
      preferredJobTypes: updatedUser.preferredJobTypes,
      skills: updatedUser.skills,
    };
    console.log("Updated user details:", updatedUser);
    return NextResponse.json(userDetails);
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json(
      { error: "Failed to update user" },
      { status: 500 }
    );
  }
}