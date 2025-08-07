import { createBrowserRouter } from "react-router";
import Error from "../components/error.component";
import SignUp from "../components/sign-up.component";
import DashboardComponent from "../components/dashboard.component";
import App from "../App";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: App,
    loader: async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get("code");

      console.log(code);
    },
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
      const code = urlParams.get("code");

      if (code) {
        await fetch(
          `http://localhost:3000/api/login/google/callback?code=${code}`
        ).then((response) => {
          if (response.ok) {
            response.json().then((data) => {
              console.log(data);
              if (!data.hasUserSignedBefore) {
                window.location.href = "http://localhost:5173/sign-up";
              }

              if (data.hasUserSignedBefore) {
                window.location.href = "http://localhost:5173/dashboard";
              }
            });
          }
        });
      }
    },
    Component: Error,
  },
]);
