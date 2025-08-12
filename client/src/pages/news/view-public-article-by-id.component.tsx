import type { News } from "@/types/news.type";
import { useOutletContext, useParams } from "react-router";
import CenterLayout from "@/components/compositions/center-layouts/center-layout.component";
import StackLayout from "@/components/compositions/stack-layouts/stack-layout.component";

import style from "./view-public-article-by-id.module.css";
import { formatNorwegianDate } from "../../utils/date.util";
import ClusterLayout from "@/components/compositions/cluster-layouts/cluster-layout.component";

const ViewPublicArticleById = () => {
  const params = useParams<{ id: string }>();
  const publicNews = useOutletContext<News[]>();

  const currentNewsItem = publicNews?.find((news) => news.id === params.id);

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
      </StackLayout>
    </CenterLayout>
  );
};

export default ViewPublicArticleById;
