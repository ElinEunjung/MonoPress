import { UserPolicy } from "../../googles/constants/user-policy.constant";
import type { UserRole } from "../../googles/constants/user-role.constant";

type PolicyArticleReaction = Extract<
  UserPolicy[keyof UserPolicy],
  "read" | "update"
>;

export interface UserModel {
  accessToken: string;
  name: string;
  email: string;
  picture: string;
  resources: {
    role: UserRole[keyof UserRole];
    policy: {
      article: {
        reaction: Array<PolicyArticleReaction>;
        comments: Array<UserPolicy[keyof UserPolicy]>;
      };
    };
  };
}
