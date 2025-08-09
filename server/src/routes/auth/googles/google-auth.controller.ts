import type { Request, Response } from "express";
import { GLOBAL_SERVER_HOST_NAME } from "../../../constants/global-server-host-name";
import { GOOGLE_DISCOVERY_ENDPOINT } from "./constants/endpoint.constant";
import { GLOBAL_GOOGLE_CONFIG } from "../../../constants/global-google-config";
import { GoogleDiscoveryConfiguration } from "./types/google-discovery-configuration.type";
import { userGoogleSchemaModel } from "./models/user-google-schema.model";
import { USER_ROLE } from "./constants/user-role.constant";
import { USER_POLICY } from "./constants/user-policy.constant";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../../../constants/global-jwt-token";

export async function handleOAuthGoogleLogin(
  _request: Request,
  response: Response
) {
  const googleDiscoveryConfiguration = await fetch(GOOGLE_DISCOVERY_ENDPOINT);
  const { authorization_endpoint } =
    (await googleDiscoveryConfiguration.json()) as GoogleDiscoveryConfiguration;

  const redirect_uri = GLOBAL_SERVER_HOST_NAME + "/api/login/google/callback";
  const urlParameter = {
    response_type: "code",
    scope: "openid profile email",
    client_id: GLOBAL_GOOGLE_CONFIG.client_id,
    redirect_uri: redirect_uri,
  };

  const authorization_url = `${authorization_endpoint}?${new URLSearchParams(urlParameter)}`;
  response.redirect(authorization_url);
}

export async function handleOAuthGoogleLogout(
  request: Request,
  response: Response
) {
  const authHeader = request.headers["authorization"] ?? "";
  const accessToken = authHeader.split(" ")[1];

  console.log(accessToken);

  if (!accessToken) {
    return response.status(400).json({
      status: "error",
      error: "Missing access token",
      error_description: "The access token is required to end the session.",
    });
  }

  try {
    // Make a request to Google's token revocation endpoint
    const revokeResponse = await fetch(
      `https://oauth2.googleapis.com/revoke?token=${accessToken}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    if (revokeResponse.ok) {
      return response.json({
        status: "success",
        message: "Session ended successfully",
      });
    } else {
      const error = await revokeResponse.json();
      return response.status(400).json({
        status: "error",
        error: error.error,
        error_description: error.error_description,
      });
    }
  } catch (error) {
    return response.status(500).json({
      status: "error",
      error: "Internal server error",
      error_description: "Failed to end the session",
    });
  }
}

export async function handleGetGoogleLoginCallback(
  request: Request,
  response: Response
) {
  const { error, error_description, code } = request.query as any;

  if (error) {
    return response.json({
      status: "error",
      error,
      error_description,
    });
  }

  if (!code) {
    return response.status(400).json({
      status: "error",
      error: "Missing authorization code",
      error_description: "The authorization code is required to proceed.",
    });
  }

  const { discovery_endpoint, client_id, client_secret, scope } =
    GLOBAL_GOOGLE_CONFIG;

  const configuration = await fetch(discovery_endpoint);
  const { token_endpoint } = await configuration.json();

  const redirect_uri = GLOBAL_SERVER_HOST_NAME + "/api/login/google/callback";

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

    const { id: googleId, email, name, picture } = userData;

    let user = await userGoogleSchemaModel.findOne({ googleId });

    let isUserRegistered = false;

    // Create the JWT payload
    const payload = { accessToken: access_token, name };

    // Sign the token with the secret key and set an expiry time
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "1m" }); // 1 minute expiry

    if (user === null) {
      const createUserSchemaPayload = {
        googleId,
        email,
        name,
        picture,
        resources: {
          role: USER_ROLE.NoneEditor,
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
      await userGoogleSchemaModel.insertOne(createUserSchemaPayload);

      response.cookie("access_token", token, {
        httpOnly: true,
        secure: false,
        maxAge: 5000,
      });

      response.json({
        isUserRegistered,
      });
    } else {
      isUserRegistered = true;

      response.cookie("access_token", token, {
        httpOnly: true,
        secure: false,
        maxAge: 5000,
      });

      response.json({
        isUserRegistered,
      });
    }
  } else {
    return response.json({
      status: "error",
      error: tokenData.error,
      error_description: tokenData.error_description,
    });
  }
}
