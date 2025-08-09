import { newsSchemaModel } from "./news-schema.mongo";

interface NewsPayload {
  title: string;
  createdAt: NativeDate;
  updatedAt: NativeDate;
  excerption: string;
  content: string;
}

async function addNews(newsPayload: NewsPayload) {
  // await newsSchemaModel.updateOne(newsPayload);

  const { title, excerption, content } = newsPayload;

  await newsSchemaModel.updateOne(
    {
      title,
    },
    {
      $set: {
        createdAt: new Date(),
        updatedAt: new Date(),
        excerption,
        content,
      },
    },
    {
      upsert: true,
    },
  );
}

export { addNews };
