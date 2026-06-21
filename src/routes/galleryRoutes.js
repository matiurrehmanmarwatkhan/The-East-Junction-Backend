import express from "express";
import { getGalleryImages, createGalleryImage, deleteGalleryImage, updateGalleryImage } from "../controllers/galleryController.js";
import { protect } from "../middlewares/authMiddleware.js";
import { upload } from "../config/cloudinary.js";

const router = express.Router();

router.route("/")
  .get(getGalleryImages)
  .post(protect, upload.single("image"), createGalleryImage);

router.route("/:id")
  .put(protect, upload.single("image"), updateGalleryImage)
  .delete(protect, deleteGalleryImage);

export default router;
