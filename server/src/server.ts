import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/db";
import path from "node:path";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
// connectDB();

// Serve static files from the Vite build directory
// app.use(express.static(path.join(__dirname, "../client/dist")));

// Routes
app.get("/", (_req, res) => {
  res.send("API is running!");
});

// Test API endpoint
app.get("/api/hello", (_req, res) => {
  res.json({ message: "Hello from backend!" });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀Server running on http://localhost:${PORT}`);
});
