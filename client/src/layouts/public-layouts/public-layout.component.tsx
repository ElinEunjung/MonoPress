import { Outlet } from "react-router";
import PublicLayoutHeader from "./components/public-layout-header";
import AuthButton from "./components/auth-button.component";
import WrapperLayout from "@/components/compositions/wrapper-layouts/wrapper-layout.component";
import AuthSession from "@/components/auths/auth-verify-session.component";
import UserInfo from "@/components/user-infos/user-info.component";

import BoxLayout from "@/components/compositions/box-layouts/box-layout.component";
import ClusterLayout from "@/components/compositions/cluster-layouts/cluster-layout.component";

import UserInfoProvider from "@/contexts/user-info-providers/user-info-provider";

const MainLayout = () => {
  return (
    <WrapperLayout is="main">
      <UserInfoProvider>
        <AuthSession>
          {({ isValidSession }) => (
            <>
              <BoxLayout paddingBlock="0.5em">
                <ClusterLayout gap="0.5em" align="center">
                  <UserInfo />
                  <AuthButton isValidSession={isValidSession} />
                </ClusterLayout>
              </BoxLayout>

              <PublicLayoutHeader />
              <Outlet />
            </>
          )}
        </AuthSession>
      </UserInfoProvider>
    </WrapperLayout>
  );
};

export default MainLayout;
