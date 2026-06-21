import express from "express";
import { getMenuItems, createMenuItem, updateMenuItem, deleteMenuItem } from "../controllers/menuController.js";
import { protect } from "../middlewares/authMiddleware.js";
import { upload } from "../config/cloudinary.js";

const router = express.Router();

router.route("/")
  .get(getMenuItems)
  .post(protect, upload.single("image"), createMenuItem);

router.route("/:id")
  .put(protect, upload.single("image"), updateMenuItem)
  .delete(protect, deleteMenuItem);

export default router;
