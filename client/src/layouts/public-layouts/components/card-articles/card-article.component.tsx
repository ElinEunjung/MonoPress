import type { News } from "@/types/news.type";
import BoxLayout from "@/components/compositions/box-layouts/box-layout.component";
import GridLayout from "@/components/compositions/grid-layouts/grid-layout.component";
import { Link } from "react-router";
import style from "./card-article.module.css";
import StackLayout from "@/components/compositions/stack-layouts/stack-layout.component";

interface CardArticleProps {
  publicNews: News[];
}

const CardArticle = ({ publicNews }: CardArticleProps) => {
  return (
    <GridLayout>
      {publicNews?.map((newsItem) => (
        <BoxLayout is="article" key={newsItem.id} className={style.article}>
          <StackLayout>
            <h2 className={style.article__title}>{newsItem.title}</h2>
            <img
              src={newsItem.imageUrl}
              alt={newsItem.title}
              className={style.article__image}
              title={newsItem.title}
            />
            <Link
              to={`/news/${newsItem.id}`}
              title={`Les mer om ${newsItem.title}`}
            >
              Les mer
            </Link>
          </StackLayout>
        </BoxLayout>
      ))}
    </GridLayout>
  );
};

export default CardArticle;
