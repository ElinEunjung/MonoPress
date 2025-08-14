import { useContext } from "react";
import { Link } from "react-router";
import { userInfoContext } from "@/contexts/user-info-providers/user-info-context";
import styles from "./user-image-link.module.css";
import type { UserInfo } from "@/types/user-info.type";

const UserImageLink = () => {
  const userInfoCtx = useContext(userInfoContext);

  const localStorageMockUser = localStorage.getItem("mock-user");

  const mockUser = localStorageMockUser
    ? (JSON.parse(localStorageMockUser) as UserInfo)
    : null;

  if (mockUser?.email === "editor@monopress.com") {
    return (
      <Link
        to="/profile"
        title={`${mockUser.name} profile page`}
        className="ml-auto"
      >
        <img
          src={mockUser?.picture}
          alt={`Image of user profile from ${mockUser?.name}`}
          className={styles["user-profile"]}
        />
      </Link>
    );
  }
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
