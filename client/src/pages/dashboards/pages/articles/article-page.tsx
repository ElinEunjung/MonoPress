import { Outlet, useLocation } from "react-router";
import { useApi } from "@/hooks/use-api";
import type { News } from "../../components/layouts/types/news.type";

import ViewDashboardArticle from "./components/view-dashboard-article.component";
import LoadingSpinner from "@/components/loading-spinner.component";

const ArticlePage = () => {
  const { data: newsData, isLoading: isLoadingNews } = useApi<News[]>("/news");

  const location = useLocation();

  if (location.pathname === "/dashboard/articles") {
    if (isLoadingNews) {
      return <LoadingSpinner />;
    }

    return <ViewDashboardArticle newsData={newsData} />;
  }

  return (
    <>{isLoadingNews ? <LoadingSpinner /> : <Outlet context={newsData} />}</>
  );
};

export default ArticlePage;
