import { newsSchemaModel } from "../../../models/news-schema.mongoose";

export const publicNewsService = {
  async getPublicNews() {
    const news = await newsSchemaModel
      .find()
      .select("_id title imageUrl category content createdAt updatedAt")
      .sort({
        createdAt: -1, // Sort latest data
      })
      .lean();

    return news.map((newsDatum) => ({
      id: newsDatum._id,
      ...newsDatum,
    }));
  },
};
