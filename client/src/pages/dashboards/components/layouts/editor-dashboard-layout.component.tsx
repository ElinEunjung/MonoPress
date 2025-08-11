import CenterLayout from "@/components/compositions/center-layouts/center-layout.component";
import AsideMenu from "./components/aside-menu.component";
import style from "./editor-dashboard-layout.module.css";
import { Outlet } from "react-router";
import WrapperLayout from "@/components/compositions/wrapper-layouts/wrapper-layout.component";
import BoxLayout from "@/components/compositions/box-layouts/box-layout.component";

const EditorDashboardLayout = () => {
  return (
    <div className={style["dashboard-layout"]}>
      <AsideMenu />
      <div className={style["dashboard-layout__content"]}>
        <CenterLayout max="50em">
          <WrapperLayout maxWidth="50em">
            <BoxLayout paddingBlock="5em">
              <Outlet />
            </BoxLayout>
          </WrapperLayout>
        </CenterLayout>
      </div>
    </div>
  );
};

export default EditorDashboardLayout;
