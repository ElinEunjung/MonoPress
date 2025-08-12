export type ArticlePayload = {
  title: string;
  image: string | File | null;
  category: string;
  imageUrl: string;
  content: string;
};

export type ArticleErrors = {
  title: string;
  image: string;
  category: string;
  imageUrl: string;
  content: string;
};
