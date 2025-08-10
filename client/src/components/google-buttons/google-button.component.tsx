import { GLOBAL_BASE_URI } from "@/constants/global-base-uri";
import GoogleLogo from "./components/google-logo.component";
import ClusterLayout from "../compositions/cluster-layouts/cluster-layout.component";
import BoxLayout from "../compositions/box-layouts/box-layout.component";
import style from "./google-button.module.css";

const GoogleButton = () => {
  return (
    <a
      href={`${GLOBAL_BASE_URI.BACKEND}/auth/login`}
      className={style["google-btn"]}
      title="Sign in with Google"
    >
      <BoxLayout padding="2px" style={{ width: "fit-content" }}>
        <ClusterLayout gap="0.5em" align="center" justify="center" noWrap>
          <GoogleLogo
            width="2.75rem"
            height="2.75rem"
            className="bg-color-white"
          />
          <BoxLayout
            paddingInline="10px"
            is="span"
            style={{ color: "inherit", whiteSpace: "nowrap" }}
          >
            Sign in with Google
          </BoxLayout>
        </ClusterLayout>
      </BoxLayout>
    </a>
  );
};

export default GoogleButton;
