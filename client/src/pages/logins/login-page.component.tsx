import CenterLayout from "@/components/compositions/center-layouts/center-layout.component";
import BoxLayout from "@/components/compositions/box-layouts/box-layout.component";
import GoogleButton from "@/components/google-buttons/google-button.component";
import StackLayout from "@/components/compositions/stack-layouts/stack-layout.component";
import SwitcherLayout from "@/components/compositions/switcher-layouts/switcher-layout.component";
import { Link } from "react-router";
import AuthVerifySession from "@/components/auths/auth-verify-session.component";

const LoginPage = () => {
  return (
    <AuthVerifySession>
      {() => (
        <BoxLayout className="bg-color-ghost">
          <CenterLayout max="50em" intrinsic>
            <BoxLayout className="bg-color-snow">
              <h1>Log in</h1>

              <form>
                <StackLayout gap="0.5em">
                  <label htmlFor="email">Email:</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="Email"
                    required
                  />
                  <label htmlFor="password">Password:</label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    placeholder="Password"
                    required
                  />

                  <SwitcherLayout limit="2" threshold="90em">
                    <button type="submit">Login</button>
                    <button type="reset">Reset</button>
                  </SwitcherLayout>
                  <GoogleButton />
                  <Link to="/" title="go back">
                    {" "}
                    Go back
                  </Link>
                </StackLayout>
              </form>
            </BoxLayout>
          </CenterLayout>
        </BoxLayout>
      )}
    </AuthVerifySession>
  );
};

export default LoginPage;
