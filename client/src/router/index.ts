import { createBrowserRouter } from "react-router";
import { api } from "@/api/api";
import { GLOBAL_BASE_URI } from "../constants/global-base-uri";

import PublicLayout from "../layouts/public-layouts/public-layout.component";
import Error from "../components/error.component";
import ProtectedRoutes from "../pages/dashboards/components/protected-routes/protected-routes.component";

import LoginPage from "../pages/logins/login-page.component";
import NewsPage from "@/pages/news/news-page.component";
import ArticlePage from "@/pages/news/pages/Article.component";
import CreateArticle from "@/pages/dashboards/components/layouts/components/create-article.component";
import ProfilePage from "@/pages/profiles/profile-page.component";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: PublicLayout,
    children: [
      {
        path: "news",
        Component: NewsPage,
        children: [
          {
            path: ":id",
            Component: ArticlePage,
          },
        ],
      },

      {
        path: "profile",
        Component: ProfilePage,
      },
    ],
  },
  {
    path: "/login",
    Component: LoginPage,
  },
  {
    path: "dashboard",
    Component: ProtectedRoutes,
    children: [
      {
        path: "create",
        Component: CreateArticle,
      },
    ],
  },
  {
    path: "/*",
    loader: async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const queryCodeParam = urlParams.get("code");

      if (queryCodeParam) {
        try {
          const response = await api.get(
            `/login/google/callback?code=${queryCodeParam}`,
          );

          if (!response.data.isUserRegistered) {
            window.location.href = `${GLOBAL_BASE_URI.FRONTEND}/dashboard`;
          }

          if (response.data.isUserRegistered) {
            window.location.href = `${GLOBAL_BASE_URI.FRONTEND}/`;
          }
        } catch (error) {
          console.error("🥲🥲🥲🥲", error);
        }
      }
    },
    Component: Error,
  },
]);
