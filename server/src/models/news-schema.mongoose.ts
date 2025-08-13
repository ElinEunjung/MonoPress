import mongoose, { Schema, Document } from "mongoose";

interface IReaction extends Document {
  userId: string;
}

interface IReactions {
  likes: IReaction[];
  dislikes: IReaction[];
}

interface IReply extends Document {
  user: {
    googleId: string;
  };
  content: string;
  createdAt: Date;
  updatedAt: Date | null;
  reactions: IReactions;
  parentId?: mongoose.Types.ObjectId;
  replies: IReply[];
}

interface IComment extends Document {
  user: {
    googleId: string;
  };
  content: string;
  createdAt: Date;
  updatedAt: Date | null;
  reactions: IReactions;
  replies: IReply[];
}

// Create schemas for nested structures
const ReactionSchema = new Schema({
  userId: { type: String, required: true },
});

const ReactionsSchema = new Schema({
  likes: [ReactionSchema],
  dislikes: [ReactionSchema],
});

// Create the reply schema with self-reference for nested replies
const ReplySchema: Schema = new Schema({
  user: {
    googleId: {
      type: String,
      required: true,
    },
  },
  content: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: null,
  },
  parentId: {
    type: Schema.Types.ObjectId,
    required: false,
  },
  reactions: {
    type: ReactionsSchema,
    default: { likes: [], dislikes: [] },
  },
});

// Add replies field after schema is defined to allow self-reference
ReplySchema.add({
  replies: [ReplySchema],
});

const CommentSchema = new Schema({
  user: {
    googleId: {
      type: String,
      required: true,
    },
  },
  content: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: null,
  },
  reactions: {
    type: ReactionsSchema,
    default: { likes: [], dislikes: [] },
  },
  replies: [ReplySchema],
});

const NEWS_MONGOOSE_SCHEMA = new Schema({
  user: {
    googleId: {
      type: String,
      required: true,
    },
  },
  title: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: null,
    required: false,
  },
  reaction: {
    likes: {
      type: Number,
      default: 0,
      required: false,
    },
    dislikes: {
      type: Number,
      default: 0,
      required: false,
    },
  },
  comments: [CommentSchema],
});

export const newsSchemaModel = mongoose.model("news", NEWS_MONGOOSE_SCHEMA);
