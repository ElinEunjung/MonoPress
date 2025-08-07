import mongoose from "mongoose";

const USER_SCHEMA = new mongoose.Schema({
  googleId: { type: String, required: true },
  email: { type: String, required: true },
  name: { type: String, required: true },
  picture: { type: String, required: false },
});

const userSchemaModel = mongoose.model("user", USER_SCHEMA);

export { userSchemaModel };
