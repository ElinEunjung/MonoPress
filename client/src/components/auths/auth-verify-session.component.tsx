import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { useLocation } from "react-router";
import { api } from "@/api/api";

interface AuthVerifySessionProps {
  children: ReactNode;
}

const AuthVerifySession = ({ children }: AuthVerifySessionProps) => {
  const [isValidSession, setIsValidSession] = useState(false);
  const location = useLocation();

  useEffect(() => {
    async function getRequestValidateJwtTokenSession() {
      try {
        await api.get("/auth/validate-session");

        setIsValidSession(true);
      } catch (_error) {
        setIsValidSession(false);
      }
    }

    getRequestValidateJwtTokenSession();
  }, [location.pathname]);

  return (
    <>
      <p>isValidSession: {JSON.stringify(isValidSession)}</p>
      {children}
    </>
  );
};

export default AuthVerifySession;
