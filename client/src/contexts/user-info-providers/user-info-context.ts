import { createContext } from "react";
import type { UserInfo } from "./user-info.type";
import { INITIAL_USER_INFO_MODEL } from "./models/constants/initial-user-info-model.constant";

export interface UserInfoContext {
  userInfo: UserInfo;
  setUserInfo: (value: UserInfo) => void;
}

export const userInfoContext = createContext<UserInfoContext>({
  userInfo: INITIAL_USER_INFO_MODEL,
  setUserInfo: (_value: UserInfo) => {},
});
