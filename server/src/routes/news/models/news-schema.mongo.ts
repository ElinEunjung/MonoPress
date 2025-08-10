import mongoose from "mongoose";

const ADD_NEWS_SCHEMA = new mongoose.Schema({
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
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: null,
    required: false,
  },
  category: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
});

const newsSchemaModel = mongoose.model("news", ADD_NEWS_SCHEMA);

export { newsSchemaModel };
