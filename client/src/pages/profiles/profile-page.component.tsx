import { useContext } from "react";
import { userInfoContext } from "@/contexts/user-info-providers/user-info-context";
import StackLayout from "@/components/compositions/stack-layouts/stack-layout.component";
import style from "./profile-page.module.css";
import CenterLayout from "@/components/compositions/center-layouts/center-layout.component";
import type { UserInfo } from "@/types/user-info.type";

const ProfilePage = () => {
  const userInfoCtx = useContext(userInfoContext);

  const localStorageMockUser = localStorage.getItem("mock-user");

  const mockUser = localStorageMockUser
    ? (JSON.parse(localStorageMockUser) as UserInfo)
    : null;

  if (mockUser?.email === "editor@monopress.com") {
    return (
      <>
        <CenterLayout max="10em" textCenter>
          <StackLayout>
            <h2>Hei {mockUser?.name}</h2>
            <img
              src={mockUser?.picture}
              alt={`Image of user profile from ${mockUser?.name}`}
              className={style["profile-image"]}
            />

            <a href={`mailto:${mockUser?.email}`}>Epost: {mockUser?.email}</a>
          </StackLayout>
        </CenterLayout>
      </>
    );
  }

  return (
    <>
      {userInfoCtx.userInfo.name && (
        <CenterLayout max="10em" textCenter>
          <StackLayout>
            <h2>Hei {userInfoCtx.userInfo.name}</h2>
            <img
              src={userInfoCtx.userInfo.picture}
              alt={`Image of user profile from ${userInfoCtx.userInfo.name}`}
              className={style["profile-image"]}
            />

            <a href={`mailto:${userInfoCtx.userInfo.email}`}>
              Epost: {userInfoCtx.userInfo.email}
            </a>
          </StackLayout>
        </CenterLayout>
      )}
    </>
  );
};

export default ProfilePage;
