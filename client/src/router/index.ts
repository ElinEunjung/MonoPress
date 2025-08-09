import { createBrowserRouter } from "react-router";
import Error from "../components/error.component";
import SignUp from "../components/sign-up.component";
import DashboardComponent from "../components/dashboard.component";
import RootLayout from "../layouts/public-layouts/public-layout.component";
import { BASE_GLOBAL_URI } from "../constants/base-global-uri";
import Login from "../components/login.component";
import ProtectedRoutes from "../components/protected-routes.component";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayout,
  },
  {
    path: "/sign-up",
    Component: SignUp,
  },
  {
    path: "/login",
    Component: Login,
  },

  {
    path: "/dashboard",
    Component: ProtectedRoutes,
    children: [
      {
        path: "edit",
        Component: DashboardComponent,
      },
    ],
  },

  {
    path: "/*",
    loader: async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const queryCodeParam = urlParams.get("code");

      if (queryCodeParam) {
        await fetch(
          `${BASE_GLOBAL_URI.BACKEND}/login/google/callback?code=${queryCodeParam}`
        ).then((response) => {
          if (response.ok) {
            response.json().then((data) => {
              localStorage.setItem("accessToken", data.accessToken);

              if (!data.isUserRegistered) {
                window.location.href = `${BASE_GLOBAL_URI.FRONTEND}/sign-up`;
              }

              if (data.isUserRegistered) {
                window.location.href = `${BASE_GLOBAL_URI.FRONTEND}/dashboard/edit`;
              }
            });
          }
        });
      }
    },
    Component: Error,
  },
]);
