import { useContext } from "react";
import { userInfoContext } from "@/contexts/user-info-providers/user-info-context";
import { Link } from "react-router";
import { baseNavLinks } from "../constants/base-nav-links.constant";
import ClusterLayout from "@/components/compositions/cluster-layouts/cluster-layout.component";
import BoxLayout from "@/components/compositions/box-layouts/box-layout.component";
import type { UserInfo } from "@/types/user-info.type";

const PublicLayoutHeader = () => {
  const userInfoCtx = useContext(userInfoContext);

  let navLinks = baseNavLinks;

  const localStorageMockUser = localStorage.getItem("mock-user");

  const mockUser = localStorageMockUser
    ? (JSON.parse(localStorageMockUser) as UserInfo)
    : null;

  if (userInfoCtx.userInfo.name || mockUser?.email === "editor@monopress.com") {
    navLinks = navLinks.concat([
      {
        id: 2,
        to: "/profile",
        title: "profile",
        textContent: "Profile",
      },
    ]);
  }
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
          {navLinks.map((navLink) => {
            const { id, to, title, textContent } = navLink;

            return (
              <BoxLayout is="li" paddingBlock="1em" key={id}>
                <Link to={to} title={title}>
                  {textContent}
                </Link>
              </BoxLayout>
            );
          })}
        </ClusterLayout>
      </nav>
    </header>
  );
};

export default PublicLayoutHeader;
