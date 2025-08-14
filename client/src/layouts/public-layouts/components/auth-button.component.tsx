import Logout from "@/components/logout.component";
import type { UserInfo } from "@/types/user-info.type";
import { Link } from "react-router";

interface AuthButtonProps {
  isValidSession: boolean;
}

const AuthButton = ({ isValidSession }: AuthButtonProps) => {
  const localStorageMockUser = localStorage.getItem("mock-user");

  const mockUser = localStorageMockUser
    ? (JSON.parse(localStorageMockUser) as UserInfo)
    : null;

  return (
    <>
      {isValidSession || mockUser?.email === "editor@monopress.com" ? (
        <Logout />
      ) : (
        <Link to="/login" title="login" className="ml-auto">
          Login
        </Link>
      )}
    </>
  );
};

export default AuthButton;
