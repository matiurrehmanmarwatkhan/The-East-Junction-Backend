import express from "express";
import { getReservations, createReservation, updateReservationStatus, deleteReservation } from "../controllers/reservationController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.route("/")
  .get(getReservations)
  .post(createReservation);

router.route("/:id")
  .put(protect, updateReservationStatus)
  .delete(protect, deleteReservation);

export default router;
