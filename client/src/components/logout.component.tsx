import { api } from "@/api/api";
import { useContext } from "react";
import { userInfoContext } from "@/contexts/user-info-providers/user-info-context";
import type { ButtonHTMLAttributes } from "react";

type LogoutProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, "onClick">;

const Logout = ({ ...restButtonProps }: LogoutProps) => {
  const userInfoCtx = useContext(userInfoContext);

  async function handleLogout() {
    if (userInfoCtx.userInfo.email === "editor@monopress.com") {
      await api.get("/auth/logout/fake-user");
      location.href = "/";
    } else {
      await api.get("/auth/logout");
      location.href = "/";
    }
  }

  return (
    <button type="button" onClick={handleLogout} {...restButtonProps}>
      Logg ut
    </button>
  );
};

export default Logout;
