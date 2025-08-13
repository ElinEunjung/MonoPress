export interface News {
  id: string;
  title: string;
  category: string;
  content: string;
  createdAt: Date;
  imageUrl: string;
  updatedAt: Date | null;
  reaction: {
    like: number;
    dislike: number;
  };
  comments: Comment[];
}

export interface Comment {
  id: string;
  content: string;
  createdAt: Date;
  updatedAt: Date | null;
  user: {
    id: string;
    name: string;
    avatarUrl: string;
  };
  replies: Comment[];
}
