import { userGoogleSchemaModel } from "../src/routes/auth/googles/models/user-google-schema.model";

export const userService = {
  async findUserByAccessToken(accessToken: string) {
    return await userGoogleSchemaModel.findOne({ accessToken });
  },
};
