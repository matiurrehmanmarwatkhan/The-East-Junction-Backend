import express from "express";
import { getBirthdayEvents, createBirthdayEvent, deleteBirthdayEvent, updateBirthdayEvent } from "../controllers/birthdayEventController.js";
import { protect } from "../middlewares/authMiddleware.js";
import { upload } from "../config/cloudinary.js";

const router = express.Router();

router.route("/")
  .get(getBirthdayEvents)
  .post(protect, upload.single("image"), createBirthdayEvent);

router.route("/:id")
  .put(protect, upload.single("image"), updateBirthdayEvent)
  .delete(protect, deleteBirthdayEvent);

export default router;
