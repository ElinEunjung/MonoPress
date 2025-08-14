export interface NewsPayload {
  user: {
    googleId: string;
  };
  title: string;
  category: string;
  imageUrl: string;
  content: string;
}
