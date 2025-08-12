import mongoose from "mongoose";

const ADD_NEWS_SCHEMA = new mongoose.Schema({
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
    default: Date.now,
  },
  excerption: {
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
