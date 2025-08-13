import { userSchemaModel } from "../models/users/user.mongoose";
import { createJwtUserPayloadFactory } from "../routes/auth/googles/helpers/create-jwt-user-payload-factory";

type InsertUserPayload = ReturnType<typeof createJwtUserPayloadFactory>;
export const userService = {
  async findUserByAccessToken(accessToken: string) {
    return await userSchemaModel.findOne({ accessToken });
  },

  async findUserByGoogleId(googleId: string) {
    return await userSchemaModel.findOne({ googleId });
  },

  async updateUserAccessToken(googleId: string, accessToken: string) {
    return await userSchemaModel.updateOne(
      { googleId }, // Filter criteria
      {
        $set: {
          accessToken,
        },
      },
    );
  },

  async insertUser(payload: InsertUserPayload) {
    return await userSchemaModel.insertOne(payload);
  },
};
