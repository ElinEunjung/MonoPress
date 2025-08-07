import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "node:path";
import { api } from "./routes/api";

dotenv.config();

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
  })
);

app.use(express.json());

// Serve static files from the Vite build directory
app.use(express.static(path.join(__dirname, "../../client/dist")));

app.use("/api", api);

// Catch-all route to serve the frontend
app.get("*", (_req, res) => {
  res.sendFile(path.join(__dirname, "../../client/dist/index.html"));
});

export { app };
