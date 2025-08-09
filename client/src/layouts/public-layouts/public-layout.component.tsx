import { Outlet } from "react-router";
import { useEffect } from "react";
import PublicLayoutHeader from "./components/public-layout-header";
import WrapperLayout from "@/components/compositions/wrapper-layouts/wrapper-layout.component";
import { BASE_GLOBAL_URI } from "@/constants/base-global-uri";

const MainLayout = () => {
  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");

    fetch(`${BASE_GLOBAL_URI.BACKEND}/user`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
      })
      .catch((error) => console.error(error));
  }, []);

  return (
    <WrapperLayout is="main">
      <PublicLayoutHeader />

      <Outlet />
    </WrapperLayout>
  );
};

export default MainLayout;
