import ClusterLayout from "@/components/compositions/cluster-layouts/cluster-layout.component";
import style from "./article-reaction.module.css";
import { useApi } from "@/hooks/use-api";
import { useParams } from "react-router";
import { useEffect, useState } from "react";
import type { News } from "@/types/news.type";

interface ReactionProps {
  currentNewsItemId: News["id"];
}

const ArticleReaction = ({ currentNewsItemId }: ReactionProps) => {
  const params = useParams<{ id: string }>();
  const [reactions, setReactions] = useState({ likes: 0, dislikes: 0 });

  const { mutate: handleToggleCommentReaction } = useApi<
    { reactions: { likes: number; dislikes: number } },
    { reactionType: "like" | "dislike" }
  >(`/articles/${params.id}/react`, {
    method: "post",
  });

  const { mutate: getReactions } = useApi<{
    reactions: { likes: number; dislikes: number };
  }>(`/articles/${params.id}/reactions`, {
    method: "get",
  });

  useEffect(() => {
    const loadReactions = async () => {
      try {
        const response = await getReactions();
        if (response?.reactions) {
          setReactions(response.reactions);
        }
      } catch (error) {
        console.error("Error loading reactions:", error);
      }
    };

    if (currentNewsItemId) {
      loadReactions();
    }
  }, [currentNewsItemId, getReactions]);

  const handleReaction = async (reactionType: "like" | "dislike") => {
    try {
      const response = await handleToggleCommentReaction({ reactionType });
      if (response?.reactions) {
        setReactions(response.reactions);
      }
    } catch (error) {
      console.error("Error toggling reaction:", error);
    }
  };
  return (
    <div className={style.articleReactions}>
      <h3>What do you think about this article?</h3>
      <ClusterLayout gap="1em">
        <button
          onClick={() => handleReaction("like")}
          className={style.reactionButton}
        >
          👍 Like ({reactions.likes})
        </button>
        <button
          onClick={() => handleReaction("dislike")}
          className={style.reactionButton}
        >
          👎 Dislike ({reactions.dislikes})
        </button>
      </ClusterLayout>
    </div>
  );
};

export default ArticleReaction;
