import { Outlet } from "react-router";
import PublicLayoutHeader from "./components/public-layout-header";
import WrapperLayout from "@/components/compositions/wrapper-layouts/wrapper-layout.component";

const MainLayout = () => {
  return (
    <WrapperLayout is="main">
      <PublicLayoutHeader />

      <Outlet />
    </WrapperLayout>
  );
};

export default MainLayout;
