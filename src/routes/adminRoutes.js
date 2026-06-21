import express from "express";
import { loginAdmin, getStats } from "../controllers/adminController.js";

const router = express.Router();

router.post("/auth/login", loginAdmin);
router.get("/stats", getStats);

export default router;
