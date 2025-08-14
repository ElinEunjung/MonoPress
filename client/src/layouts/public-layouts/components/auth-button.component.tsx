import Logout from "@/components/logout.component";
import { Link } from "react-router";

interface AuthButtonProps {
  isValidSession: boolean;
}

const AuthButton = ({ isValidSession }: AuthButtonProps) => {
  return (
    <>
      {isValidSession ? (
        <Logout />
      ) : (
        <Link to="/login" title="login" className="ml-auto">
          Logg inn
        </Link>
      )}
    </>
  );
};

export default AuthButton;
