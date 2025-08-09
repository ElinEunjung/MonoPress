import type { Request, Response } from "express";
import { GLOBAL_GOOGLE_CONFIG } from "../../constants/global-google-config";

export async function handleGetUserByAccessToken(
  request: Request,
  response: Response,
) {
  const authHeader = request.headers["authorization"];

  console.log(authHeader);
  // if (!accessToken) {
  //   return response.status(400).json({
  //     status: "error",
  //     error: "Missing access token",
  //     error_description: "The access token is required to proceed.",
  //   });
  // }

  // try {
  //   // Verify the token using Google's tokeninfo endpoint
  //   const tokenInfoResponse = await fetch(
  //     `https://oauth2.googleapis.com/tokeninfo?access_token=${accessToken}`
  //   );

  //   if (!tokenInfoResponse.ok) {
  //     return response.status(401).json({
  //       status: "error",
  //       error: "Invalid token",
  //       error_description: "The provided access token is invalid or expired.",
  //     });
  //   }

  //   const tokenInfo = await tokenInfoResponse.json();

  //   console.log(tokenInfo);

  //   // Verify that the token was issued for your application
  //   if (tokenInfo.aud !== GLOBAL_GOOGLE_CONFIG.client_id) {
  //     return response.status(401).json({
  //       status: "error",
  //       error: "Invalid token",
  //       error_description: "The token was not issued for this application.",
  //     });
  //   }
  // } catch (error) {
  //   return response.status(500).json({
  //     status: "error",
  //     error: "Internal server error",
  //     error_description: "Failed to verify access token",
  //   });
  // }
}
