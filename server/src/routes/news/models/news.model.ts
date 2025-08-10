import { newsSchemaModel } from "./news-schema.mongo";

interface NewsPayload {
  user: {
    googleId: string;
  };
  title: string;
  category: string;
  content: string;
}

async function addNews(newsPayload: NewsPayload) {
  const { title, category, content, user } = newsPayload;

  try {
    const newNews = await newsSchemaModel.create({
      title,
      category,
      content,
      user: {
        googleId: user.googleId,
      },
      createdAt: new Date(),
      updatedAt: null,
    });

    return newNews;
  } catch (error) {
    console.error("Error adding news:", error);
    throw error;
  }
}

export { addNews };
