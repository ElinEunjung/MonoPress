import type { ReactElement } from "react";
import AuthVerifySession from "@/components/auths/auth-verify-session.component";
import CenterLayout from "@/components/compositions/center-layouts/center-layout.component";
import StackLayout from "@/components/compositions/stack-layouts/stack-layout.component";
import LoadingSpinner from "@/components/loading-spinner.component";

import UnauthorizedAnonymousUserMessage from "./components/unauthorized-anonymous-user-message.component";
import UnauthorizedNoneEditorUserMessage from "./components/unauthorized-none-editor-user-message.component";

import EditorDashboardLayout from "../layouts/editor-dashboard-layout.component";
import type { UserInfo } from "@/types/user-info.type";

const ProtectedRoutes = () => {
  let renderComponent: ReactElement | null = null;
  const localStorageMockUser = localStorage.getItem("mock-user");

  const mockUser = localStorageMockUser
    ? (JSON.parse(localStorageMockUser) as UserInfo)
    : null;

  if (mockUser?.email === "editor@monopress.com") {
    return <EditorDashboardLayout user={mockUser} />;
  }

  return (
    <AuthVerifySession>
      {({ isValidSession, user, isLoading }) => {
        if (isLoading) {
          return (
            <CenterLayout max="50em" intrinsic center textCenter>
              <LoadingSpinner />
            </CenterLayout>
          );
        }

        if (isValidSession && user && user.resources.role === "editor") {
          renderComponent = <EditorDashboardLayout user={user} />;
        }

        if (!isValidSession) {
          renderComponent = (
            <>
              <CenterLayout max="50em" intrinsic textCenter>
                <StackLayout gap="0">
                  <UnauthorizedAnonymousUserMessage />
                </StackLayout>
              </CenterLayout>
            </>
          );
        }

        if (isValidSession && user && user.resources.role === "none-editor") {
          renderComponent = (
            <CenterLayout max="50em" intrinsic textCenter>
              <StackLayout gap="0">
                <UnauthorizedNoneEditorUserMessage />{" "}
              </StackLayout>
            </CenterLayout>
          );
        }
        return <main>{renderComponent}</main>;
      }}
    </AuthVerifySession>
  );
};

export default ProtectedRoutes;
