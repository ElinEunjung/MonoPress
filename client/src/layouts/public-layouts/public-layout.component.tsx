import { Outlet } from "react-router";
import PublicLayoutHeader from "./components/public-layout-header";
import WrapperLayout from "@/components/compositions/wrapper-layouts/wrapper-layout.component";

import AuthSession from "@/components/auths/auth-verify-session.component";

const MainLayout = () => {
  return (
    <WrapperLayout is="main">
      <PublicLayoutHeader />

      <AuthSession>
        <Outlet />
      </AuthSession>
    </WrapperLayout>
  );
};

export default MainLayout;
