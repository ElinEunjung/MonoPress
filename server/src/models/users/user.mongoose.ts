import mongoose from "mongoose";
import { USER_POLICY } from "../../routes/auth/googles/constants/user-policy.constant";
import { USER_ROLE } from "../../routes/auth/googles/constants/user-role.constant";
import { userPolicy } from "./helpers/user-policies.helper";

const USER_SCHEMA = new mongoose.Schema({
  accessToken: { type: String, required: true },
  googleId: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: false },
  name: { type: String, required: true },
  picture: { type: String, required: false },
  resources: {
    role: {
      type: String,
      required: true,
      validate: {
        validator: userPolicy.isRoleValid,
        message: `Role must either be ${USER_ROLE.Editor} or ${USER_ROLE.NoneEditor}`,
      },
    },
    policy: {
      article: {
        reaction: {
          type: [String],
          validate: {
            validator: userPolicy.isSomeArticleReactionValid,
            message: `Policies must include either "${USER_POLICY.UPDATE}" or "${USER_POLICY.READ}"  permissions.`,
          },
        },
        comments: {
          type: [String],
          validate: {
            validator: userPolicy.isSomeArticleCommentValid,
            message: `Policies must include either "${USER_POLICY.READ}", "${USER_POLICY.DELETE}", "${USER_POLICY.UPDATE}" or "${USER_POLICY.WRITE}" permissions.`,
          },
        },
      },
    },
  },
});

export const userSchemaModel = mongoose.model("user", USER_SCHEMA);
