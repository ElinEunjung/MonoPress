import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const MONGO_URI = process.env.MONGO_URI as string;

mongoose.connection.once("open", () => {
  console.log(`✅ MongoDB connection established`);
});

mongoose.connection.on("error", (error) => {
  console.error("❌ MongoDB connection error:", error);
});

async function mongoDBConnect() {
  await mongoose.connect(MONGO_URI);
}

async function mongoDBDisconnect() {
  await mongoose.disconnect();
}

export { mongoDBConnect, mongoDBDisconnect };
