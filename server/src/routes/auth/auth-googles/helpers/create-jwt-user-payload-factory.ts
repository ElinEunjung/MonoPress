import { USER_POLICY } from "../constants/user-policy.constant";
import { USER_ROLE } from "../constants/user-role.constant";
import type { UserRole } from "../constants/user-role.constant";

interface UserPayload {
  accessToken: string;
  name: string;
  email: string;
  picture: string;
  googleId: string;
  resources: {
    role: string | UserRole;
  };
}

const INITIAL_USER_PAYLOAD = {
  accessToken: "",
  name: "",
  email: "",
  picture: "",
  googleId: "",
  resources: {
    role: USER_ROLE.NoneEditor,
  },
};

export function createJwtUserPayloadFactory(
  payload: UserPayload = INITIAL_USER_PAYLOAD
) {
  return {
    accessToken: payload.accessToken,
    name: payload.name,
    email: payload.email,
    picture: payload.picture,
    googleId: payload.googleId,
    resources: {
      role: payload.resources?.role || USER_ROLE.NoneEditor,
      policy: {
        article: {
          reaction: [USER_POLICY.READ, USER_POLICY.UPDATE],
          comments: [
            USER_POLICY.READ,
            USER_POLICY.WRITE,
            USER_POLICY.DELETE,
            USER_POLICY.UPDATE,
          ],
        },
      },
    },
  };
}
