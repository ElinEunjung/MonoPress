import { USER_POLICY } from "../../../routes/auth/auth-googles/constants/user-policy.constant";
import { USER_ROLE } from "../../../routes/auth/auth-googles/constants/user-role.constant";

type RoleValue = (typeof USER_ROLE)[keyof typeof USER_ROLE];

export const userPolicy = {
  isRoleValid(value: RoleValue) {
    let isValid = false;

    if (value === USER_ROLE.Editor) {
      isValid = true;
    }

    if (value === USER_ROLE.NoneEditor) {
      isValid = true;
    }

    return isValid;
  },
  isSomeArticleCommentValid(policies: string[]) {
    const requiredPolicies = [
      USER_POLICY.READ,
      USER_POLICY.WRITE,
      USER_POLICY.DELETE,
      USER_POLICY.UPDATE,
    ];

    return requiredPolicies.some((policy) => policies.includes(policy));
  },
  isSomeArticleReactionValid(policies: string[]) {
    const requiredPolicies = [USER_POLICY.READ, USER_POLICY.UPDATE];

    return requiredPolicies.some((policy) => policies.includes(policy));
  },
};
