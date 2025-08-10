import Logout from "@/components/logout.component";
import { BASE_GLOBAL_URI } from "@/constants/base-global-uri";

interface AuthButtonProps {
  isValidSession: boolean;
}

const AuthButton = ({ isValidSession }: AuthButtonProps) => {
  return (
    <>
      {isValidSession ? (
        <Logout />
      ) : (
        <a href={`${BASE_GLOBAL_URI.BACKEND}/auth/login`} className="ml-auto">
          Login with Google
        </a>
      )}
    </>
  );
};

export default AuthButton;
