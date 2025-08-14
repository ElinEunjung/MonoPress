import type { UserInfo } from "../../../../types/user-info.type";

export const INITIAL_USER_INFO_MODEL: UserInfo = {
  email: "",
  name: "",
  picture: "",
  resources: {
    role: "",
    policy: {
      article: {
        reaction: [],
        comments: [],
      },
    },
  },
};
