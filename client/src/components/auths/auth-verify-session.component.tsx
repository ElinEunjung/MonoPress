import type { ReactNode } from "react";
import { useEffect, useState, useContext } from "react";
import { useLocation } from "react-router";
import { api } from "@/api/api";
import { userInfoContext } from "@/contexts/user-info-providers/user-info-context";
import type { UserInfo } from "@/contexts/user-info-providers/user-info.type";
import { INITIAL_USER_INFO_MODEL } from "@/contexts/user-info-providers/models/constants/initial-user-info-model.constant";
interface AuthVerifySessionProps {
  children: (props: { isValidSession: boolean }) => ReactNode;
}

const AuthVerifySession = ({ children }: AuthVerifySessionProps) => {
  const [isValidSession, setIsValidSession] = useState(false);
  const location = useLocation();

  const userInfoCtx = useContext(userInfoContext);

  useEffect(() => {
    async function getRequestValidateJwtTokenSession() {
      try {
        const rawUserInfo = await api.get<UserInfo>("/auth/validate-session");
        userInfoCtx.setUserInfo(rawUserInfo.data);

        setIsValidSession(true);
      } catch (_error) {
        setIsValidSession(false);
        userInfoCtx.setUserInfo(INITIAL_USER_INFO_MODEL);
      }
    }

    getRequestValidateJwtTokenSession();
  }, [location.pathname]);

  return children({ isValidSession });
};

export default AuthVerifySession;
