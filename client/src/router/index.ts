import { createBrowserRouter } from "react-router";
import Error from "../components/error.component";
import SignUp from "../components/sign-up.component";
import DashboardComponent from "../components/dashboard.component";
import App from "../App";
import { BASE_GLOBAL_URI } from "../constants/base-global-uri";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: App,
  },
  {
    path: "/sign-up",
    Component: SignUp,
  },
  {
    path: "/dashboard",
    Component: DashboardComponent,
  },
  {
    path: "/*",
    loader: async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const queryCodeParam = urlParams.get("code");

      console.log(queryCodeParam);
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
                window.location.href = `${BASE_GLOBAL_URI.FRONTEND}/dashboard`;
              }
            });
          }
        });
      }
    },
    Component: Error,
  },
]);
