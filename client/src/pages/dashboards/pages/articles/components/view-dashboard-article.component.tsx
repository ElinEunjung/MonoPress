import { formatNorwegianDate } from "@/utils/date.util";
import { Link } from "react-router";
import type { News } from "../../../../../types/news.type";
import { useApi } from "@/hooks/use-api";
import { useState, useEffect } from "react";
import StackLayout from "@/components/compositions/stack-layouts/stack-layout.component";

interface ViewDashboardArticleProps {
  newsData: News[] | undefined;
}

const ViewDashboardArticle = ({ newsData }: ViewDashboardArticleProps) => {
  const [articleId, setArticleId] = useState("");

  const api = useApi(`/news/${articleId}`, {
    method: "delete",
  });

  useEffect(() => {
    if (articleId) {
      api.mutate();
    }

    if (api.isSuccess) {
      window.location.reload();
    }
  }, [articleId, api.isSuccess]);

  if (newsData?.length === 0) {
    return (
      <StackLayout>
        <h1>Ingen nyheter tilgjengelig</h1>
        <Link to="/dashboard/articles/new">Opprett en nyhets artikkel</Link>
      </StackLayout>
    );
  }
  return (
    <>
      <h1>News</h1>

      <table>
        <thead>
          <tr>
            <th scope="col">Tittel</th>
            <th scope="col">Kategori</th>
            <th scope="col">Opprettet</th>
            <th scope="col">Oppdatert</th>
            <th scope="col">Endre</th>
            <th scope="col">Slett</th>
          </tr>
        </thead>
        <tbody>
          {newsData?.map((newsDatum) => {
            return (
              <tr key={newsDatum.id}>
                <td>{newsDatum.title}</td>
                <td>{newsDatum.category}</td>
                <td>{formatNorwegianDate(newsDatum.createdAt)}</td>
                <td>
                  {formatNorwegianDate(newsDatum.updatedAt!, "Ikke oppdatert")}
                </td>

                <td>
                  <Link
                    to={`/dashboard/articles/edit/${newsDatum.id}`}
                    title={`Rediger ${newsDatum.title}`}
                  >
                    📝 Rediger
                  </Link>
                </td>
                <td>
                  <button
                    type="button"
                    onClick={() => setArticleId(newsDatum.id)}
                  >
                    ❌ Slett
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </>
  );
};

export default ViewDashboardArticle;
