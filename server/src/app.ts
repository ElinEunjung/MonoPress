import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "node:path";

dotenv.config();

const app = express();
// Middleware
app.use(
  cors({
    origin: "http://localhost:5173",
  })
);

app.use(express.json());
// Serve static files from the Vite build directory
app.use(express.static(path.join(__dirname, "../../client/dist")));

// API endpoints should come before the catch-all route
app.get("/api/hello", (_req, res) => {
  res.json({ message: "Hello from backend!" });
});

// Catch-all route to serve the frontend
app.get("*", (_req, res) => {
  res.sendFile(path.join(__dirname, "../../client/dist/index.html"));
});

export default app;
