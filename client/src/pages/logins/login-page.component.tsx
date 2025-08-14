import CenterLayout from "@/components/compositions/center-layouts/center-layout.component";
import BoxLayout from "@/components/compositions/box-layouts/box-layout.component";
import GoogleButton from "@/components/google-buttons/google-button.component";
import StackLayout from "@/components/compositions/stack-layouts/stack-layout.component";
import { Link } from "react-router";
import AuthVerifySession from "@/components/auths/auth-verify-session.component";
import LoginForm from "./components/login-form.component";

const LoginPage = () => {
  return (
    <AuthVerifySession>
      {() => (
        <BoxLayout className="bg-color-ghost">
          <CenterLayout max="50em" intrinsic center>
            <BoxLayout className="bg-color-snow">
              <h1>Log in</h1>
              <StackLayout>
                <LoginForm />
                <GoogleButton />
                <Link to="/" title="go back">
                  Go back
                </Link>
              </StackLayout>
            </BoxLayout>
          </CenterLayout>
        </BoxLayout>
      )}
    </AuthVerifySession>
  );
};

export default LoginPage;
