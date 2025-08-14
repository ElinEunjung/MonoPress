import jwt from "jsonwebtoken";
import type { SignOptions } from "jsonwebtoken";
import { JWT_SECRET } from "../../../../constants/auth/global-jwt-token";
import { randomBytes } from "crypto";

type JwtTokenHelperPayload = Parameters<(typeof jwt)["sign"]>[0];

export const JwtTokenHelper = {
  create(
    payload: JwtTokenHelperPayload,
    options: SignOptions = {
      expiresIn: "3h",
    }
  ) {
    return jwt.sign(payload, JWT_SECRET, options);
  },
  verifyAndDecrypt<TData>(token: string) {
    return jwt.verify(token, JWT_SECRET) as TData;
  },
  generateRandomAccessToken() {
    return randomBytes(32).toString("hex");
  },
};
