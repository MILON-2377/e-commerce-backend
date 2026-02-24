import { v2 as cloudinary } from "cloudinary";
import { getConfig } from ".";

cloudinary.config({
  cloud_name: getConfig.CLOUDINARY.CLOUDINARY_NAME,
  api_key: getConfig.CLOUDINARY.API_KEY,
  api_secret: getConfig.CLOUDINARY.API_SECRET,
  timeout: 60000
});

export default cloudinary;
