import { useState } from "react";
import style from "./comment.module.css";
import { useApi } from "@/hooks/use-api";
import StackLayout from "@/components/compositions/stack-layouts/stack-layout.component";
import ClusterLayout from "@/components/compositions/cluster-layouts/cluster-layout.component";

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
  parentId?: string; // ID of the parent comment if this is a reply
};

type CommentProps = {
  comment: CommentType;
  articleId: string;
  level?: number;
  onCommentUpdate: () => void;
};

export const Comment = ({
  comment,
  articleId,
  level = 0,
  onCommentUpdate,
}: CommentProps) => {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replyContent, setReplyContent] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);

  const baseEndpoint = `/articles/${articleId}/comments/${comment._id}`;

  const { isLoading: replyLoading, mutate: postReply } = useApi<
    CommentType,
    { content: string }
  >(`${baseEndpoint}/replies`, {
    method: "post",
  });

  const { mutate: handleToggleCommentReaction } = useApi<
    CommentType,
    { reactionType: "like" | "dislike" }
  >(`/articles/${articleId}/comments/${comment._id}/react`, {
    method: "post",
  });

  const { mutate: handleDeleteComment } = useApi<void>(
    `/articles/${articleId}/comments/${comment._id}`,
    { method: "delete" }
  );

  const { isLoading: editLoading, mutate: handleEditComment } = useApi<
    CommentType,
    { content: string }
  >(`/articles/${articleId}/comments/${comment._id}`, {
    method: "put",
  });

  const handleReply = async () => {
    if (!replyContent.trim()) return;

    await postReply({ content: replyContent });
    setReplyContent("");
    setShowReplyForm(false);
    onCommentUpdate();
  };

  const handleEdit = async () => {
    if (!editContent.trim()) return;

    try {
      await handleEditComment({ content: editContent });
      setIsEditing(false);
      onCommentUpdate();
    } catch (error) {
      console.error("Error editing comment:", error);
    }
  };

  const handleCancelEdit = () => {
    setEditContent(comment.content); // Reset to original content
    setIsEditing(false);
  };

  const handleReaction = async (reactionType: "like" | "dislike") => {
    await handleToggleCommentReaction({ reactionType });
    onCommentUpdate();
  };

  const handleDelete = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this comment?"
    );
    if (confirmed) {
      try {
        console.log("Attempting to delete comment:", comment._id);
        console.log(
          "Full URL:",
          `/articles/${articleId}/comments/${comment._id}`
        );
        const result = await handleDeleteComment();
        console.log("Delete response:", result);
        onCommentUpdate();
      } catch (error) {
        console.error("Error deleting comment:", error);
      }
    }
  };

  return (
    <div className={style.comment} style={{ marginLeft: `${level * 20}px` }}>
      <StackLayout gap="0.5em">
        {isEditing ? (
          <div className={style.editForm}>
            <textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              placeholder="Edit your comment..."
            />
            <ClusterLayout>
              <button onClick={handleEdit} disabled={editLoading}>
                Save Changes
              </button>
              <button onClick={handleCancelEdit}>Cancel</button>
            </ClusterLayout>
          </div>
        ) : (
          <p className={style.content}>{comment.content}</p>
        )}

        <ClusterLayout gap="1em" className={style.actions}>
          <div className={style.reactions}>
            <button onClick={() => handleReaction("like")}>
              👍 {comment.reactions?.likes?.length || 0}
            </button>
            <button onClick={() => handleReaction("dislike")}>
              👎 {comment.reactions?.dislikes?.length || 0}
            </button>
          </div>

          <div>
            <button onClick={() => setShowReplyForm(!showReplyForm)}>
              Reply
            </button>
            {!isEditing && (
              <button onClick={() => setIsEditing(true)}>Edit</button>
            )}
            <button onClick={handleDelete} className={style.deleteButton}>
              Delete
            </button>
          </div>
        </ClusterLayout>

        {showReplyForm && (
          <div className={style.replyForm}>
            <textarea
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              placeholder="Write your reply..."
            />
            <ClusterLayout>
              <button onClick={handleReply} disabled={replyLoading}>
                Submit Reply
              </button>
              <button onClick={() => setShowReplyForm(false)}>Cancel</button>
            </ClusterLayout>
          </div>
        )}

        {comment.replies?.length > 0 && (
          <div className={style.replies}>
            {comment.replies.map((reply) => (
              <Comment
                key={reply._id}
                comment={reply}
                articleId={articleId}
                level={level + 1}
                onCommentUpdate={onCommentUpdate}
              />
            ))}
          </div>
        )}
      </StackLayout>
    </div>
  );
};
