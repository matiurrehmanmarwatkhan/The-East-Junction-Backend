import express from "express";
import { getMessages, createMessage, markMessageRead, deleteMessage } from "../controllers/messageController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.route("/")
  .get(protect, getMessages)
  .post(createMessage);

router.route("/:id")
  .put(protect, markMessageRead)
  .delete(protect, deleteMessage);

export default router;
