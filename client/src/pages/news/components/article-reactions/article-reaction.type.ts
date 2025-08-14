export type Reaction = {
  reactions: {
    likes: number;
    dislikes: number;
  };
};

export type ReactionType = "like" | "dislike";
