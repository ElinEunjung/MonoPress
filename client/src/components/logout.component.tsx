import type { ButtonHTMLAttributes } from "react";
import { BASE_GLOBAL_URI } from "../constants/base-global-uri";

type LogoutProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, "onClick">;

const Logout = ({ ...restButtonProps }: LogoutProps) => {
  async function handleLogout() {
    const accessToken = localStorage.getItem("accessToken");

    await fetch(`${BASE_GLOBAL_URI.BACKEND}/auth/logout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ accessToken }),
    }).then((response) => {
      if (response.ok) {
        localStorage.removeItem("accessToken");
        location.href = "/";
      }
    });
  }

  return (
    <button type="button" onClick={handleLogout} {...restButtonProps}>
      Logout
    </button>
  );
};

export default Logout;
