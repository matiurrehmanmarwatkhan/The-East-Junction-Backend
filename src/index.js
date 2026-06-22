import express from "express";
import cors from "cors";
import { config } from "dotenv";
import { connectDB } from "./config/db.js";
import allRoutes from "./routes/index.js";

config();

const app = express();
let dbConnected = false;

// Connect to MongoDB once
connectDB()
  .then(() => {
    dbConnected = true;
    console.log("MongoDB connected successfully");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err.message);
  });

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

// Middleware to check database connection
app.use((req, res, next) => {
  if (!dbConnected) {
    return res.status(503).json({
      success: false,
      message: "Database is still connecting. Please try again.",
    });
  }
  next();
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
