import express from "express";
import { upload } from "../config/cloudinary.js";
import { uploadImage } from "../controllers/uploadController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Secure file uploads so only authorized admin can upload
router.post("/", protect, upload.single("image"), uploadImage);

export default router;
