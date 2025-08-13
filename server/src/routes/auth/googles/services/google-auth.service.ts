import { GLOBAL_GOOGLE_CONFIG } from "../../../../configs/googles/global-google-config";
import { GLOBAL_SERVER_HOST_NAME } from "../../../../configs/googles/global-server-host-name";
import { GOOGLE_END_POINT } from "../constants/endpoint.constant";

import { resultUtil } from "../../../../utils/result.utils";
import { GoogleDiscoveryConfiguration } from "../types/google-discovery-configuration.type";
import { UserModel } from "../../models/types/user-model.type";

import type { GoogleAuthUserInfo } from "../types/google-auth-user-info.type";

type AccessToken = UserModel["accessToken"];

export const googleAuthService = {
  async fetchDiscoveryConfiguration() {
    try {
      const googleDiscoveryConfiguration = await fetch(
        GOOGLE_END_POINT.DISCOVERY,
      );

      if (!googleDiscoveryConfiguration.ok) {
        return resultUtil.error(
          500,
          "Failed to fetch Google discovery configuration.",
        );
      }

      const { authorization_endpoint } =
        (await googleDiscoveryConfiguration.json()) as GoogleDiscoveryConfiguration;

      const redirect_uri = `${GLOBAL_SERVER_HOST_NAME}/api/login/google/callback`;

      const googleQueryParams = new URLSearchParams({
        response_type: "code",
        scope: "openid profile email",
        client_id: GLOBAL_GOOGLE_CONFIG.client_id,
        redirect_uri: redirect_uri,
      });

      const authUrl = `${authorization_endpoint}?${googleQueryParams.toString()}`;
      return resultUtil.success(200, authUrl);
    } catch (error) {
      return resultUtil.error(
        500,
        `Error fetching Google discovery configuration: ${error}`,
      );
    }
  },
  async revokeGoogleSignByAccessToken(accessToken: AccessToken) {
    const revokeResponse = await fetch(
      `https://oauth2.googleapis.com/revoke?token=${accessToken}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      },
    );

    if (!revokeResponse.ok) {
      return resultUtil.error(400, "Session outdated. Please log in again.");
    }

    return resultUtil.success(204);
  },
  async fetchUserAccessTokenByAuthCode(code: string) {
    const { client_id, client_secret, scope } = GLOBAL_GOOGLE_CONFIG;

    const configuration = await fetch(GOOGLE_END_POINT.DISCOVERY);
    const { token_endpoint } = await configuration.json();

    const redirect_uri = GLOBAL_SERVER_HOST_NAME + "/api/login/google/callback";

    // Create the token request payload
    const tokenRequest = {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        code: code,
        client_id: client_id,
        client_secret: client_secret,
        redirect_uri: redirect_uri,
        grant_type: "authorization_code",
        scope: scope,
      }).toString(),
    };

    const tokenResult = await fetch(token_endpoint, tokenRequest);

    if (!tokenResult.ok) {
      return resultUtil.error(503, "Failed to fetch access token.");
    }

    const tokenData = await tokenResult.json();
    return resultUtil.success(200, tokenData.access_token);
  },

  async fetchUserInformationByAccessToken(accessToken: AccessToken) {
    const result = await fetch(GOOGLE_END_POINT.OAUTH_USER_INFO, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!result.ok) {
      return resultUtil.error(400, "Failed to fetch user information.");
    }

    const userData = await result.json();
    return resultUtil.success<GoogleAuthUserInfo>(200, userData);
  },
};
