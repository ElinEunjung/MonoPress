import { createBrowserRouter } from "react-router";
import Error from "../components/error.component";
import DashboardComponent from "../components/dashboard.component";
import PublicLayout from "../layouts/public-layouts/public-layout.component";
import { BASE_GLOBAL_URI } from "../constants/base-global-uri";
import Login from "../components/login.component";
import ProtectedRoutes from "../components/protected-routes.component";
import { api } from "@/api/api";

import News from "@/pages/news/news.component";
import Article from "@/pages/news/pages/Article.component";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: PublicLayout,
    children: [
      {
        path: "news",
        Component: News,
        children: [
          {
            path: ":id",
            Component: Article,
          },
        ],
      },
      {
        path: "login",
        Component: Login,
      },
      {
        path: "dashboard",
        Component: ProtectedRoutes,
        children: [
          {
            path: "edit",
            Component: DashboardComponent,
          },
        ],
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
            window.location.href = `${BASE_GLOBAL_URI.FRONTEND}/sign-up`;
          }

          if (response.data.isUserRegistered) {
            window.location.href = `${BASE_GLOBAL_URI.FRONTEND}/`;
          }
        } catch (error) {
          console.error("🥲🥲🥲🥲", error);
        }
      }
    },
    Component: Error,
  },
]);
