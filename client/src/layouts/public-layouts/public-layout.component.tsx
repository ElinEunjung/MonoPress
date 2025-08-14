import { Outlet } from "react-router";
import PublicLayoutHeader from "./components/public-layout-header";
import AuthButton from "./components/auth-button.component";
import WrapperLayout from "@/components/compositions/wrapper-layouts/wrapper-layout.component";
import AuthVerifySession from "@/components/auths/auth-verify-session.component";
import UserImageLink from "@/components/user-image-links/user-image-link.component";

import BoxLayout from "@/components/compositions/box-layouts/box-layout.component";
import ClusterLayout from "@/components/compositions/cluster-layouts/cluster-layout.component";

import UserInfoProvider from "@/contexts/user-info-providers/user-info-provider";
import CardArticle from "./components/card-articles/card-article.component";
import { useLocation } from "react-router";
import { useApi } from "@/hooks/use-api";
import type { News } from "@/types/news.type";
import CenterLayout from "@/components/compositions/center-layouts/center-layout.component";
import LoadingSpinner from "@/components/loading-spinner.component";

const MainLayout = () => {
  const location = useLocation();
  const { data: publicNewsData, isLoading: isLoadingPublicNews } =
    useApi<News[]>("/public-news");

  return (
    <WrapperLayout is="main">
      <UserInfoProvider>
        <AuthVerifySession>
          {({ isValidSession, user }) => (
            <>
              <BoxLayout paddingBlock="0.5em">
                <ClusterLayout gap="0.5em" align="center">
                  <UserImageLink />
                  <AuthButton isValidSession={isValidSession} />
                </ClusterLayout>
              </BoxLayout>
              <PublicLayoutHeader />
              {isLoadingPublicNews && (
                <CenterLayout intrinsic center>
                  <LoadingSpinner />
                </CenterLayout>
              )}

              {location.pathname === "/" && (
                <CardArticle publicNews={publicNewsData!} />
              )}
              <Outlet context={{ publicNewsData, user }} />
            </>
          )}
        </AuthVerifySession>
      </UserInfoProvider>
    </WrapperLayout>
  );
};

export default MainLayout;
