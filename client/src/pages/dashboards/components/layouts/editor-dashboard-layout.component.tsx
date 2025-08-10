import AsideMenu from "./components/aside-menu.component";
import style from "./editor-dashboard-layout.module.css";
import { Outlet } from "react-router";

const EditorDashboardLayout = () => {
  return (
    <div className={style["dashboard-layout"]}>
      <AsideMenu />
      <div className={style["dashboard-layout__content"]}>
        <Outlet />
      </div>
    </div>
  );
};

export default EditorDashboardLayout;
