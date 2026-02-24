import { FastifyInstance } from "fastify";
import UploadController from "./upload.controller";

export default function uploadRoutes(route: FastifyInstance) {
  route.post("/upload-images", UploadController.uploadImage);
}
