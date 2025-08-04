import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const app= express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json())

app.get('/', (_req, res) => {
    res.send('API is running!');
});

// Connect to MongoDB and start server
mongoose.connect(process.env.MONGO_URI || '', {})
    .then(() => {
        console.log('MongoDB connected');
        app.listen(PORT, () => {
            console.log(`Server running on http://localhost:${PORT}`);
        });
    })
    .catch(err => {
        console.error(`MongoDB connection error:`, err);
    });