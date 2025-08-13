import { useState } from "react";
import { useApi } from "@/hooks/use-api";
import { Comment } from "@/components/comments/comment.component";
import StackLayout from "@/components/compositions/stack-layouts/stack-layout.component";
import style from "./comments-section.module.css";

type CommentType = {
  _id: string;
  user: {
    googleId: string;
  };
  content: string;
  createdAt: string;
  reactions: {
    likes: Array<{ userId: string }>;
    dislikes: Array<{ userId: string }>;
  };
  replies: CommentType[];
};

type CommentsProps = {
  articleId: string;
};

export const CommentsSection = ({ articleId }: CommentsProps) => {
  const [newComment, setNewComment] = useState("");
  const {
    data,
    isLoading,
    mutate: fetchComments,
  } = useApi<CommentType[]>(`/articles/${articleId}/comments`);

  // Ensure we have an array of comments
  const comments = Array.isArray(data) ? data : [];

  const { isLoading: isPosting, mutate: postComment } = useApi<
    CommentType,
    { content: string }
  >(`/articles/${articleId}/comments`, { method: "post" });

  const handleSubmitComment = async () => {
    if (!newComment.trim()) return;

    await postComment({ content: newComment });
    setNewComment("");
    fetchComments();
  };

  const handleCommentUpdate = () => {
    fetchComments();
  };

  if (isLoading) {
    return <div>Loading comments...</div>;
  }

  return (
    <StackLayout gap="1em" className={style.commentsSection}>
      <h3>Comments</h3>

      <div className={style.newComment}>
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Write a comment..."
          className={style.commentInput}
        />
        <button
          onClick={handleSubmitComment}
          disabled={isPosting}
          className={style.submitButton}
        >
          Post Comment
        </button>
      </div>

      <div className={style.commentsList}>
        {Array.isArray(comments) &&
          comments.map((comment: CommentType) => (
            <Comment
              key={comment._id}
              comment={comment}
              articleId={articleId}
              onCommentUpdate={handleCommentUpdate}
            />
          ))}
      </div>
    </StackLayout>
  );
};
