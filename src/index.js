import express from "express";
import cors from "cors";
import { config } from "dotenv";
import { connectDB } from "./config/db.js";
import allRoutes from "./routes/index.js";

// Import Routers

config();

// Connect to MongoDB
connectDB();

const app = express();
const PORT = process.env.PORT || 3001;

// Middlewares
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
  }),
);
app.use(express.json({ limit: "50mb" })); // Increase limit for base64 image strings
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// API Routes mounting
app.use("/api", allRoutes);
// Simple Health Check
app.get("/health", (req, res) => {
  res.json({ status: "OK", message: "Luxury Restaurant Backend Operational" });
});

// Start Server
app.listen(PORT, () => {
  console.log(`Luxury Restaurant Server running on http://localhost:${PORT}`);
});
