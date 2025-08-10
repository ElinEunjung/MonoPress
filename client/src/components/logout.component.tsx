import type { ButtonHTMLAttributes } from "react";

import { api } from "@/api/api";

type LogoutProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, "onClick">;

const Logout = ({ ...restButtonProps }: LogoutProps) => {
  async function handleLogout() {
    try {
      await api.get("/auth/logout");
      location.href = "/";
    } catch (error) {
      console.error(error as Error);
    }
  }

  return (
    <button type="button" onClick={handleLogout} {...restButtonProps}>
      Logout
    </button>
  );
};

export default Logout;
