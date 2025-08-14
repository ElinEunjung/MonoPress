import type { ReactNode } from "react";
import { useState } from "react";
import { userInfoContext as UserInfoContext } from "./user-info-context";
import { INITIAL_USER_INFO_MODEL } from "./models/constants/initial-user-info-model.constant";

import type { UserInfo } from "../../types/user-info.type";

const UserInfoProvider = ({ children }: { children: ReactNode }) => {
  const [userInfo, setUserInfo] = useState<UserInfo>(INITIAL_USER_INFO_MODEL);

  const userInfoContextValue = {
    userInfo,
    setUserInfo,
  };

  return (
    <UserInfoContext.Provider value={userInfoContextValue}>
      {children}
    </UserInfoContext.Provider>
  );
};

export default UserInfoProvider;
