import { useContext } from "react";
import { Link } from "react-router";
import { userInfoContext } from "@/contexts/user-info-providers/user-info-context";
import styles from "./user-info.module.css";

const UserInfo = () => {
  const userInfoCtx = useContext(userInfoContext);

  return (
    <>
      {userInfoCtx.userInfo.name && (
        <>
          <Link
            to="/profile"
            title={`${userInfoCtx.userInfo.name} profile page`}
            className="ml-auto"
          >
            <img
              src={userInfoCtx.userInfo.picture}
              alt={`Image of user profile from ${userInfoCtx.userInfo.name}`}
              className={styles["user-profile"]}
            />
          </Link>
        </>
      )}
    </>
  );
};

export default UserInfo;
