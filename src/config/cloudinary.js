import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";
import dotenv from "dotenv";

dotenv.config();

// Configure Cloudinary credentials
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || "dwtpzh7qy", // default fallback or client credentials
  api_key: process.env.CLOUDINARY_API_KEY || "861578761159841",
  api_secret: process.env.CLOUDINARY_API_SECRET || "g9mSsn5d98UisU5lO1gS0G8v144",
});

// Configure Multer Storage for Cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "the_east_junction",
    allowed_formats: ["jpg", "png", "jpeg", "webp", "gif"],
    transformation: [{ width: 1000, height: 800, crop: "limit" }],
  },
});

const upload = multer({ storage: storage });

export { cloudinary, upload };
export default upload;
