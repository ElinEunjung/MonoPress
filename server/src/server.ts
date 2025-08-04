import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/db";

dotenv.config();

const app= express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json())

// Connect to MongoDB
connectDB()

// Routes
app.get('/', (_req, res) => {
    res.send('API is running!');
});

// start server
app.listen(PORT, () => {
    console.log(`🚀Server running on http://localhost:${PORT}`);
});