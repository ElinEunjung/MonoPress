import { useContext } from "react";
import { userInfoContext } from "@/contexts/user-info-providers/user-info-context";
import styles from "./user-info.module.css";

const UserInfo = () => {
  const userInfoCtx = useContext(userInfoContext);

  return (
    <>
      {userInfoCtx.userInfo.name && (
        <>
          <p className="ml-auto">{userInfoCtx.userInfo.name}</p>

          <img
            src={userInfoCtx.userInfo.picture}
            alt={`Image of user profile from ${userInfoCtx.userInfo.name}`}
            className={styles["user-profile"]}
          />
        </>
      )}
    </>
  );
};

export default UserInfo;
