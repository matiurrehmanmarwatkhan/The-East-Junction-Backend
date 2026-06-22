import express from "express";
import cors from "cors";
import { config } from "dotenv";
import { connectDB } from "./config/db.js";
import allRoutes from "./routes/index.js";

config();

const app = express();
let dbConnectPromise = null;

const ensureDBConnected = async () => {
  if (!dbConnectPromise) {
    dbConnectPromise = connectDB();
  }
  return dbConnectPromise;
};

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

// Middleware to ensure DB connection before handling API requests
app.use(async (req, res, next) => {
  try {
    await ensureDBConnected();
    next();
  } catch (err) {
    console.error("MongoDB connection error:", err.message);
    res.status(503).json({
      success: false,
      message: "Database connection failed. Please try again later.",
    });
  }
});

// API Routes mounting
app.use("/api", allRoutes);

// Root endpoint
app.get("/", (req, res) => {
  res.json({ status: "OK", message: "Luxury Restaurant Backend Operational" });
});

// Favicon handler to avoid browser 404 noise
app.get("/favicon.ico", (req, res) => {
  res.status(204).end();
});

// Simple Health Check
app.get("/health", (req, res) => {
  res.json({ status: "OK", message: "Luxury Restaurant Backend Operational" });
});

// Start server locally (for development)
const PORT = process.env.PORT || 3001;
if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => {
    console.log(`Luxury Restaurant Server running on http://localhost:${PORT}`);
  });
}

export default app;
