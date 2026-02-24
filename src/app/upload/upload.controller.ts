import { FastifyReply, FastifyRequest } from "fastify";
import asyncHandler from "../../utils/asyncHandler";
import AppError from "../../utils/AppError";
import path from "path";
import fs from "fs";
import { pipeline } from "stream/promises";
import UploadService from "./upload.service";
import AppResponse from "../../utils/AppResponse";

export default class UploadController {
  public static uploadImage = asyncHandler(
    async (req: FastifyRequest, res: FastifyReply) => {
      try {
        const files = req.files();

        if (!files) {
          return res.status(400).send({
            message: "No Files uploaded",
          });
        }

        const allowedFileTypes = ["image/png", "image/jpeg", "image/webp"];
        const uploadedImages: Array<{
          url: string;
          public_id: string;
        }> = [];

        for await (const file of files) {
          if (!allowedFileTypes.includes(file.mimetype)) {
            throw AppError.badRequest(
              "Only PNG, JPEG, adn WEBP images are allowed",
            );
          }

          const ext = path.extname(file.filename);
          const uniqueName = `${crypto.randomUUID()}${ext}`;

          const uploadPath = path.join(
            process.cwd(),
            "src",
            "uploads",
            uniqueName,
          );

          await pipeline(file.file, fs.createWriteStream(uploadPath));

          const result = await UploadService.uploadToCloudinary(uploadPath);

          uploadedImages.push({
            url: result.secure_url,
            public_id: result.public_id,
          });
        }

        return res
          .status(200)
          .send(AppResponse.ok(uploadedImages, "Uploaded images successfully"));

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        if (error.code === "FST_REQ_FILE_TOO_LARGE") {
          throw AppError.badRequest("File size exceeds 5mb limit");
        }

        if (error instanceof AppError) {
          throw error;
        }

        if (error?.message) {
          throw AppError.badRequest(error.message);
        }

        throw AppError.internal(
          "File upload error",
          error instanceof Error ? error : undefined,
        );
      }
    },
  );
}
