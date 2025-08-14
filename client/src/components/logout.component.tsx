import type { ButtonHTMLAttributes } from "react";

import { api } from "@/api/api";
import type { UserInfo } from "@/types/user-info.type";

type LogoutProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, "onClick">;

const Logout = ({ ...restButtonProps }: LogoutProps) => {
  const localStorageMockUser = localStorage.getItem("mock-user");

  const mockUser = localStorageMockUser
    ? (JSON.parse(localStorageMockUser) as UserInfo)
    : null;

  async function handleLogout() {
    if (mockUser?.email === "editor@monopress.com") {
      localStorage.removeItem("mock-user");
      location.href = "/";
    } else {
      await api.get("/auth/logout");
      location.href = "/";
    }
  }

  return (
    <button type="button" onClick={handleLogout} {...restButtonProps}>
      Logout
    </button>
  );
};

export default Logout;
