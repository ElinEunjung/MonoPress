import ClusterLayout from "@/components/compositions/cluster-layouts/cluster-layout.component";
import style from "./article-reaction.module.css";
import { useApi } from "@/hooks/use-api";
import { useParams } from "react-router";
import { useEffect, useState } from "react";
import type { News } from "@/types/news.type";
import type { Reaction, ReactionType } from "./article-reaction.type";

interface ReactionProps {
  currentNewsItemId: News["id"];
}

const ArticleReaction = ({ currentNewsItemId }: ReactionProps) => {
  const params = useParams<{ id: string }>();
  const [reactions, setReactions] = useState({ likes: 0, dislikes: 0 });

  const { mutate: mutateToggleCommentReaction, isError } = useApi<{
    reactions: { likes: number; dislikes: number };
  }>(`/articles/${params.id}/react`, {
    method: "post",
  });

  const { mutate: mutateReactions, error } = useApi<Reaction>(
    `/articles/${params.id}/reactions`,
    {
      method: "get",
    }
  );

  useEffect(() => {
    if (isError) {
      alert("Du må være innlogget for å kunne reagere på artikler");
    }
  }, [isError]);

  useEffect(() => {
    const loadReactions = async () => {
      const response = await mutateReactions();
      if (response?.reactions) {
        setReactions(response.reactions);
      } else {
        console.error("Error loading reactions!", error);
      }
    };

    if (currentNewsItemId) {
      loadReactions();
    }
  }, [currentNewsItemId, mutateReactions, error]);

  const handleReaction = async (reactionType: ReactionType) => {
    try {
      const response = await mutateToggleCommentReaction({ reactionType });
      if (response?.reactions) {
        setReactions(response.reactions);
      }
    } catch (error) {
      console.error("Error toggling reaction:", error);
    }
  };
  return (
    <div className={style.articleReactions}>
      <h3>Hva syntes du om denne artikkelen?</h3>

      <ClusterLayout gap="1em" align="center">
        <button
          type="button"
          onClick={() => handleReaction("like")}
          className={style.reactionButton}
        >
          👍 Like ({reactions.likes})
        </button>

        <button
          type="button"
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
