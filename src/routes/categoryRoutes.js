import express from "express";
import { getCategories, createCategory, deleteCategory } from "../controllers/categoryController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.route("/")
  .get(getCategories)
  .post(protect, createCategory);

router.route("/:id")
  .delete(protect, deleteCategory);

export default router;
