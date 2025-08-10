import { Link } from "react-router";
import { baseNavLinks } from "../constants/base-nav-links.constant";
import ClusterLayout from "@/components/compositions/cluster-layouts/cluster-layout.component";
import BoxLayout from "@/components/compositions/box-layouts/box-layout.component";

const PublicLayoutHeader = () => {
  return (
    <header>
      <BoxLayout
        is="h1"
        paddingBlock="2em"
        className=" text-center bg-color-smoke"
      >
        MonoPress
      </BoxLayout>

      <nav>
        <ClusterLayout
          is="ul"
          className="list-none"
          justify="center"
          align="center"
        >
          {baseNavLinks.map((navLink) => {
            const { id, to, title, textContent } = navLink;

            return (
              <li key={id}>
                <Link to={to} title={title}>
                  {textContent}
                </Link>
              </li>
            );
          })}
        </ClusterLayout>
      </nav>
    </header>
  );
};

export default PublicLayoutHeader;
