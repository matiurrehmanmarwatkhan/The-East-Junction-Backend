import express from "express";
import cors from "cors";
import { config } from "dotenv";
import { connectDB } from "./config/db.js";
import allRoutes from "./routes/index.js";

// Import Routers

config();

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

// Connect to MongoDB and Start Server
const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(
        `Luxury Restaurant Server running on http://localhost:${PORT}`,
      );
    });
  } catch (error) {
    console.error("Failed to start server:", error.message);
    process.exit(1);
  }
};

startServer();

export default app;
