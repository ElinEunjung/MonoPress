import jwt from "jsonwebtoken";
import type { SignOptions } from "jsonwebtoken";
import { JWT_SECRET } from "../../../../constants/auth/global-jwt-token";

type JwtTokenPayload = Parameters<(typeof jwt)["sign"]>[0];

export const JwtToken = {
  create(
    payload: JwtTokenPayload,
    options: SignOptions = {
      expiresIn: "3h",
    },
  ) {
    return jwt.sign(payload, JWT_SECRET, options);
  },
  verifyAndDecrypt<TData>(token: string) {
    return jwt.verify(token, JWT_SECRET) as TData;
  },
};
