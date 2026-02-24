/* eslint-disable @typescript-eslint/no-explicit-any */
import cloudinary from "../../config/cloudinary.config";
import AppError from "../../utils/AppError";
import fs from "fs";

export default class UploadService {
  public static uploadToCloudinary = async (filePath: string) => {
    try {
      const result = await cloudinary.uploader.upload(filePath, {
        folder: "uploads",
        resource_type: "auto",
      });

      fs.unlinkSync(filePath);

      return result;
    } catch (error: any) {

      console.error(error)

      if (error instanceof AppError) {
        throw error;
      }

      if (error?.message) {
        throw AppError.badRequest(error.message);
      }

      throw AppError.internal(
        "Failed to upload cloudinary ",
        error instanceof Error ? error : undefined,
      );
    }
  };
}
