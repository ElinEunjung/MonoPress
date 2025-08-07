import dotenv from "dotenv";

dotenv.config();

export const GLOBAL_GOOGLE_CONFIG = {
  client_id: process.env.GOOGLE_CLIENT_ID as string,
  client_secret: process.env.GOOGLE_CLIENT_SECRET as string,
  scope: "openid profile email",
  discovery_endpoint:
    "https://accounts.google.com/.well-known/openid-configuration",
} as const;
