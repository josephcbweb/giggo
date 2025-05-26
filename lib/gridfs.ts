import mongoose from "mongoose";
import { GridFSBucket } from "mongodb";

let gridFSBucket: GridFSBucket;

export const initGridFS = () => {
  try {
    const conn = mongoose.connection;
    gridFSBucket = new mongoose.mongo.GridFSBucket(conn.db, {
      bucketName: "user_images",
    });
    console.log("GridFS initialized successfully");
  } catch (error) {
    console.error("Error initializing GridFS:", error);
    throw error;
  }
};

export const uploadImageToGridFS = async (
  fileBuffer: Buffer,
  filename: string
): Promise<string> => {
  if (!gridFSBucket) {
    throw new Error("GridFS not initialized. Call initGridFS() first.");
  }

  return new Promise((resolve, reject) => {
    const uploadStream = gridFSBucket.openUploadStream(filename);
    const fileId = uploadStream.id.toString();

    uploadStream.on("error", (error) => {
      console.error("Upload stream error:", error);
      reject(error);
    });

    uploadStream.on("finish", () => {
      resolve(fileId);
    });

    uploadStream.end(fileBuffer);
  });
};


export const getImageFromGridFS = async (fileId: string): Promise<Buffer> => {
  if (!gridFSBucket) {
    throw new Error("GridFS not initialized");
  }

  const downloadStream = gridFSBucket.openDownloadStream(
    new mongoose.Types.ObjectId(fileId)
  );

  const chunks: Uint8Array[] = [];
  for await (const chunk of downloadStream) {
    chunks.push(chunk);
  }

  if (chunks.length === 0) {
    throw new Error("Image not found");
  }

  return Buffer.concat(chunks);
};

// Helper to detect content type
const detectContentType = async (buffer: Buffer): Promise<string> => {
  const fileType = await import('file-type');
  const type = await fileType.fileTypeFromBuffer(buffer);
  return type?.mime || 'image/jpeg'; // default to jpeg if unknown
};

// Delete image from GridFS
export const deleteImageFromGridFS = async (fileId: string) => {
  if (!gridFSBucket) {
    throw new Error("GridFS not initialized. Call initGridFS() first.");
  }

  try {
    await gridFSBucket.delete(new mongoose.Types.ObjectId(fileId));
    console.log("Image deleted successfully");
  } catch (error) {
    console.error("Error deleting image:", error);
    throw error;
  }
};