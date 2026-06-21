import express from "express";
import { getSettings, updateSettings } from "../controllers/restaurantSettingController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.route("/")
  .get(getSettings)
  .put(protect, updateSettings)
  .post(protect, updateSettings);

export default router;
