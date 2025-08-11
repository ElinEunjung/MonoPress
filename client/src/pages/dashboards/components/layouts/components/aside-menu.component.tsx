import style from "../editor-dashboard-layout.module.css";
import StackLayout from "@/components/compositions/stack-layouts/stack-layout.component";
import { Link } from "react-router";
import BoxLayout from "@/components/compositions/box-layouts/box-layout.component";

const AsideMenu = () => {
  return (
    <BoxLayout is="aside" className={style["dashboard-layout__aside"]}>
      <StackLayout gap="0.5em" recursive>
        <h2>MonoPress meny</h2>
        <hr />
        <StackLayout is="menu" className="list-none" gap="0.5em">
          <li>
            <Link to="/dashboard/articles" title="Liste av alle artikler">
              Liste Artikler
            </Link>
          </li>
          <li>
            <Link to="/dashboard/articles/new" title="opprett artikkel">
              Opprett artikkel
            </Link>
          </li>
          <li>
            <Link to="/" title="Gå til forssiden">
              Gå til forssiden
            </Link>
          </li>
        </StackLayout>
      </StackLayout>
    </BoxLayout>
  );
};

export default AsideMenu;
