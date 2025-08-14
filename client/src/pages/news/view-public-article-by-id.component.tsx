import type { News } from "@/types/news.type";
import { useOutletContext, useParams } from "react-router";
import { useState, useEffect } from "react";
import CenterLayout from "@/components/compositions/center-layouts/center-layout.component";
import StackLayout from "@/components/compositions/stack-layouts/stack-layout.component";
import { CommentsSection } from "@/components/comments/comments-section.component";
import { useApi } from "@/hooks/use-api";

import style from "./view-public-article-by-id.module.css";
import { formatNorwegianDate } from "../../utils/date.util";
import ClusterLayout from "@/components/compositions/cluster-layouts/cluster-layout.component";

const ViewPublicArticleById = () => {
  const params = useParams<{ id: string }>();
  const publicNews = useOutletContext<News[]>();
  const [reactions, setReactions] = useState({ likes: 0, dislikes: 0 });

  const currentNewsItem = publicNews?.find((news) => news.id === params.id);

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

  // Load initial reactions when component mounts
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

    if (currentNewsItem?.id) {
      loadReactions();
    }
  }, [currentNewsItem?.id, getReactions]);

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

  if (!currentNewsItem) {
    return <h2>Ingen Nyheter</h2>;
  }

  return (
    <CenterLayout max="50em" intrinsic>
      <StackLayout is="article" gap="0.5em" className={style.article}>
        <h2>{currentNewsItem.title}</h2>

        <img src={currentNewsItem.imageUrl} alt={currentNewsItem.title} />

        <ClusterLayout>
          <p>
            <strong>Opprettet:</strong>
            {formatNorwegianDate(currentNewsItem.createdAt)}
          </p>

          {currentNewsItem.updatedAt && (
            <>
              <p>
                <strong>oppdatert:</strong>
                {formatNorwegianDate(currentNewsItem.createdAt)}
              </p>
            </>
          )}
        </ClusterLayout>

        <p>
          <strong>Kategori: </strong>
          {currentNewsItem.category}
        </p>

        <hr />
        <p style={{ whiteSpace: "pre-wrap" }}>{currentNewsItem.content}</p>

        {/* Article Reactions */}
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

        <hr />
        <CommentsSection articleId={currentNewsItem.id} />
      </StackLayout>
    </CenterLayout>
  );
};

export default ViewPublicArticleById;
