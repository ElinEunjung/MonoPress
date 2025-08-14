import CenterLayout from "@/components/compositions/center-layouts/center-layout.component";
import StackLayout from "@/components/compositions/stack-layouts/stack-layout.component";
import type { News } from "@/types/news.type";
import { useOutletContext, useParams } from "react-router";
import { CommentsSection } from "./components/comments-sections/comments-section.component";

import ClusterLayout from "@/components/compositions/cluster-layouts/cluster-layout.component";
import { formatNorwegianDate } from "../../utils/date.util";
import style from "./view-public-article-by-id.module.css";

import ArticleReaction from "./components/article-reactions/article-reaction.component";
import type { UserInfo } from "@/types/user-info.type";
import BoxLayout from "@/components/compositions/box-layouts/box-layout.component";

const ViewPublicArticleById = () => {
  const params = useParams<{ id: string }>();

  const outletCtx = useOutletContext<{
    publicNewsData: News[];
    user: UserInfo | null;
  }>();

  const currentNewsItem = outletCtx.publicNewsData?.find((news) => {
    return news.id === params.id;
  });

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

        <ArticleReaction currentNewsItemId={currentNewsItem.id} />

        <hr />
        <p style={{ whiteSpace: "pre-wrap" }}>{currentNewsItem.content}</p>

        {!outletCtx.user && (
          <BoxLayout className="bg-color-oyster">
            <p>❌Du må være innlogget for å kunne kommentere.</p>
          </BoxLayout>
        )}

        {outletCtx.user && (
          <>
            <hr />
            <CommentsSection articleId={currentNewsItem.id} />
          </>
        )}
      </StackLayout>
    </CenterLayout>
  );
};

export default ViewPublicArticleById;
