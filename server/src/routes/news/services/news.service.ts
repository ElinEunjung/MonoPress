import { newsSchemaModel } from "../models/news-schema.mongo";
import { userGoogleSchemaModel } from "../../auth/googles/models/user-google-schema.model";
import type { NewsPayload } from "../models/news.model";
import { Types } from "mongoose";

type ObjectId = Types.ObjectId;

const projectionNewsField = {
  title: 1 as const,
  category: 1 as const,
  content: 1 as const,
  createdAt: 1 as const,
  updatedAt: 1 as const,
  id: "$_id",
  _id: 0 as const,
} satisfies Record<string, any>;

export const newsService = {
  async getUserNewsByGoogleId(googleId: string) {
    return await newsSchemaModel
      .find({ "user.googleId": googleId }, projectionNewsField)
      .sort({ createdAt: -1 });
  },

  async findNewsById(id: string, googleId: string) {
    return await newsSchemaModel.findOne({
      _id: id,
      "user.googleId": googleId,
    });
  },

  async deleteNewsById(id: string, googleId: string) {
    return await newsSchemaModel.deleteOne({
      _id: id,
      "user.googleId": googleId,
    });
  },

  async updateNews(payload: {
    newsId: ObjectId;
    googleId: string;
    data: Omit<NewsPayload, "user"> & { updatedAt: Date };
  }) {
    const { newsId, googleId, data } = payload;

    return await newsSchemaModel.findOneAndUpdate(
      {
        _id: newsId,
        "user.googleId": googleId,
      },
      {
        $set: data, //update operator that allows you to modify specific fields in a document
      },
      {
        new: true, // returns the document after the update was applied
      },
    );
  },

  async findUserByAccessToken(accessToken: string) {
    return await userGoogleSchemaModel.findOne({ accessToken });
  },
};
