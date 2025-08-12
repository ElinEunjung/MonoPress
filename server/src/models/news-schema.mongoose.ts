import mongoose from "mongoose";

const NEWS_MONGOOSE_SCHEMA = new mongoose.Schema({
  user: {
    googleId: {
      type: String,
      required: true,
    },
  },
  title: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: null,
    required: false,
  },
  comments: {
    userId: {},
  },
});

export const newsSchemaModel = mongoose.model("news", NEWS_MONGOOSE_SCHEMA);
