import { userInfoContext } from "@/contexts/user-info-providers/user-info-context";
import type { UserInfo } from "@/contexts/user-info-providers/user-info.type";
import { useApi } from "@/hooks/use-api";
import type { ReactNode } from "react";
import { useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";
interface AuthVerifySessionProps {
  children: (props: {
    isValidSession: boolean;
    isLoading: boolean;
    user: UserInfo | null;
  }) => ReactNode;
}

const AuthVerifySession = ({ children }: AuthVerifySessionProps) => {
  const [isValidSession, setIsValidSession] = useState(false);
  const location = useLocation();

  const navigate = useNavigate();
  const userInfoCtx = useContext(userInfoContext);

  const isLoginPage = location.pathname === "/login";

  if (isLoginPage && isValidSession) {
    navigate("/");
  }

  const { data: userInfoData, isLoading } = useApi<UserInfo>(
    "/auth/validate-session",
  );

  useEffect(() => {
    if (userInfoData) {
      userInfoCtx.setUserInfo(userInfoData);
      setIsValidSession(true);
    }
  }, [userInfoData, location.pathname, userInfoCtx]);

  return children({
    isValidSession,
    isLoading,
    user: userInfoData,
  });
};

export default AuthVerifySession;
