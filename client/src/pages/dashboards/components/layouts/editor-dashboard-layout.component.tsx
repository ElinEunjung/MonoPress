import CenterLayout from "@/components/compositions/center-layouts/center-layout.component";
import AsideMenu from "./components/aside-menu.component";
import style from "./editor-dashboard-layout.module.css";
import { Outlet } from "react-router";
import WrapperLayout from "@/components/compositions/wrapper-layouts/wrapper-layout.component";
import BoxLayout from "@/components/compositions/box-layouts/box-layout.component";
import StackLayout from "@/components/compositions/stack-layouts/stack-layout.component";
import type { UserInfo } from "@/contexts/user-info-providers/user-info.type";

import { useLocation } from "react-router";
import type { ReactElement } from "react";
interface EditorDashboardLayoutProps {
  user: UserInfo;
}
const EditorDashboardLayout = ({ user }: EditorDashboardLayoutProps) => {
  const location = useLocation();
  let welcomeComponent: ReactElement | null = null;

  if (location.pathname === "/dashboard") {
    welcomeComponent = (
      <StackLayout gap="0.5em">
        <h1>Hei {user.name} 👋</h1>
        <p>Velkommen til din redaktørportal.</p>
        <p>
          Her kan du <strong>legge til</strong> din artikkel eller{" "}
          <strong>redigere </strong> eksisterende artikler.
        </p>
      </StackLayout>
    );
  }

  return (
    <div className={style["dashboard-layout"]}>
      <AsideMenu />
      <div className={style["dashboard-layout__content"]}>
        <CenterLayout max="50em" center>
          <WrapperLayout maxWidth="50em">
            <BoxLayout paddingBlock="5em">
              {welcomeComponent}
              <Outlet />
            </BoxLayout>
          </WrapperLayout>
        </CenterLayout>
      </div>
    </div>
  );
};

export default EditorDashboardLayout;
