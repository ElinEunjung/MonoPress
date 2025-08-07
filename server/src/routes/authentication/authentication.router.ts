import express from "express";
import type { Request, Response } from "express";
import { GLOBAL_SERVER_HOST_NAME } from "../../constants/global-server-host-name";
import { GOOGLE_DISCOVERY_ENDPOINT } from "./constants/endpoint.constant";
import type { GoogleDiscoveryConfiguration } from "./types/google-discovery-configuration.type";
import dotenv from "dotenv";

dotenv.config();

const authenticationRouter = express.Router();

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID as string;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET as string;

const GOOGLE = {
  client_id: process.env.GOOGLE_CLIENT_ID,
  client_secret: process.env.GOOGLE_CLIENT_SECRET,
  discovery_endpoint:
    "https://accounts.google.com/.well-known/openid-configuration",
  scope: "openid profile email",
};

authenticationRouter.get(
  "/login/google/start",
  async (_request: Request, response: Response) => {
    const googleDiscoveryConfiguration = await fetch(GOOGLE_DISCOVERY_ENDPOINT);
    const { authorization_endpoint } =
      (await googleDiscoveryConfiguration.json()) as GoogleDiscoveryConfiguration;

    const redirect_uri = GLOBAL_SERVER_HOST_NAME + "/api/login/google/callback";
    const urlParameter = {
      response_type: "code",
      scope: "openid profile email",
      client_id: GOOGLE_CLIENT_ID,
      redirect_uri: redirect_uri,
    };

    const authorization_url = `${authorization_endpoint}?${new URLSearchParams(urlParameter)}`;
    response.redirect(authorization_url);
  }
);

authenticationRouter.get(
  "/login/google/callback",
  async (request: Request, response: Response) => {
    const { error, error_description, code } = request.query as any;

    if (error) {
      return response.json({
        status: "error",
        error,
        error_description,
      });
    }

    if (code) {
      const { discovery_endpoint, client_id, client_secret, scope } = GOOGLE;

      const configuration = await fetch(discovery_endpoint);
      const { token_endpoint } = await configuration.json();

      const redirect_uri =
        GLOBAL_SERVER_HOST_NAME + "/api/login/google/callback";

      // Create the token request payload
      const tokenRequest = {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          code: code as string,
          client_id: client_id as string,
          client_secret: client_secret as string,
          redirect_uri: redirect_uri,
          grant_type: "authorization_code",
          scope: scope,
        }).toString(),
      };

      const tokenResult = await fetch(token_endpoint, tokenRequest);

      const tokenData = await tokenResult.json();

      console.log(tokenData);

      if (tokenResult.ok) {
        const { access_token } = tokenData;

        // Fetch user information using the access token
        const userInfoResponse = await fetch(
          "https://www.googleapis.com/oauth2/v2/userinfo",
          {
            headers: {
              Authorization: `Bearer ${access_token}`,
            },
          }
        );

        const userData = await userInfoResponse.json();

        console.log(userData);

        // if (hasUserSignedBefore) {
        //   return response.send();
        // } else {
        //   return response.send("/sign-up");
        // }
      } else {
        return response.json({
          status: "error",
          error: tokenData.error,
          error_description: tokenData.error_description,
        });
      }
    }
  }
);

export { authenticationRouter };
