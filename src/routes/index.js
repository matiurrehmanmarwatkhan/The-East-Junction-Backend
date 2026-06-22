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

router.use("/", adminRoutes);
router.use("/categories", categoryRoutes);
router.use("/menu", menuRoutes);
router.use("/reviews", reviewRoutes);
router.use("/gallery", galleryRoutes);
router.use("/messages", messageRoutes);
router.use("/settings", restaurantSettingRoutes);
router.use("/reservations", reservationRoutes);
router.use("/events", birthdayEventRoutes);
router.use("/chat", chatRoutes);
router.use("/upload", uploadRoutes);

export default router;
