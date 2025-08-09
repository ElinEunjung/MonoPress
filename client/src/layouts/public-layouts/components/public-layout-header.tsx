import { Link } from "react-router";
import { baseNavLinks } from "../constants/base-nav-links.constant";
import { GLOBAL_USER_CONFIG } from "@/domains/constants/global-user-config.constant";
import Logout from "@/components/logout.component";
import ClusterLayout from "@/components/compositions/cluster-layouts/cluster-layout.component";
import BoxLayout from "@/components/compositions/box-layouts/box-layout.component";
import { BASE_GLOBAL_URI } from "@/constants/base-global-uri";

const PublicLayoutHeader = () => {
  return (
    <>
      <BoxLayout paddingBlock="1em">
        <ClusterLayout is="nav">
          {GLOBAL_USER_CONFIG.AccessToken ? (
            <Logout className="ml-auto" />
          ) : (
            <a
              href={`${BASE_GLOBAL_URI.BACKEND}/auth/login`}
              className="ml-auto"
            >
              Login with Google
            </a>
          )}
        </ClusterLayout>
      </BoxLayout>
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
    </>
  );
};

export default PublicLayoutHeader;
