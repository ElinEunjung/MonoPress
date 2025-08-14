import { userInfoContext } from "@/contexts/user-info-providers/user-info-context";
import { useContext } from "react";
import { Link } from "react-router";
import styles from "./user-image-link.module.css";

const UserImageLink = () => {
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

export default UserImageLink;
