import type { ReactElement } from "react";
import AuthVerifySession from "@/components/auths/auth-verify-session.component";
import CenterLayout from "@/components/compositions/center-layouts/center-layout.component";
import StackLayout from "@/components/compositions/stack-layouts/stack-layout.component";
import LoadingSpinner from "@/components/loading-spinner.component";

import UnauthorizedAnonymousUserMessage from "./components/unauthorized-anonymous-user-message.component";
import UnauthorizedNoneEditorUserMessage from "./components/unauthorized-none-editor-user-message.component";

import EditorDashboardLayout from "../layouts/editor-dashboard-layout.component";

const ProtectedRoutes = () => {
  let renderComponent: ReactElement | null = null;

  return (
    <AuthVerifySession>
      {({ isValidSession, user, isLoading }) => {
        if (isLoading) {
          return (
            <CenterLayout max="50em" intrinsic textCenter>
              <LoadingSpinner />
            </CenterLayout>
          );
        }

        if (isValidSession && user!.resources.role === "editor") {
          renderComponent = <EditorDashboardLayout />;
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

        if (isValidSession && user!.resources.role === "none-editor") {
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
