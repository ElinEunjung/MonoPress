import { useContext } from "react";
import { userInfoContext } from "@/contexts/user-info-providers/user-info-context";
import StackLayout from "@/components/compositions/stack-layouts/stack-layout.component";
import style from "./profile-page.module.css";
import CenterLayout from "@/components/compositions/center-layouts/center-layout.component";

const ProfilePage = () => {
  const userInfoCtx = useContext(userInfoContext);

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
