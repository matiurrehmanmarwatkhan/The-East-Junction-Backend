import { Router } from "express";
import adminRoutes from "./adminRoutes.js";
import categoryRoutes from "./categoryRoutes.js";
import menuRoutes from "./menuRoutes.js";
import reviewRoutes from "./reviewRoutes.js";
import galleryRoutes from "./galleryRoutes.js";
import messageRoutes from "./messageRoutes.js";
import restaurantSettingRoutes from "./restaurantSettingRoutes.js";
import reservationRoutes from "./reservationRoutes.js";
import birthdayEventRoutes from "./birthdayEventRoutes.js";
import chatRoutes from "./chatRoutes.js";
import uploadRoutes from "./uploadRoutes.js";

const router = Router();

router.use("/api", adminRoutes);
router.use("/api/categories", categoryRoutes);
router.use("/api/menu", menuRoutes);
router.use("/api/reviews", reviewRoutes);
router.use("/api/gallery", galleryRoutes);
router.use("/api/messages", messageRoutes);
router.use("/api/settings", restaurantSettingRoutes);
router.use("/api/reservations", reservationRoutes);
router.use("/api/events", birthdayEventRoutes);
router.use("/api/chat", chatRoutes);
router.use("/api/upload", uploadRoutes);

export default router;
