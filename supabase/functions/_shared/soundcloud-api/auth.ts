import { SoundCloudTokenResponseSchema } from "./schemas.ts";

let cachedToken: {
  token: string;
  expiresAt: number;
  refreshToken: string;
} | null = null;

export async function getSoundCloudAccessToken(
  clientId: string,
  clientSecret: string,
): Promise<string> {
  if (
    cachedToken &&
    cachedToken.expiresAt > Date.now() + 60 * 1000 // 1 minute buffer
  ) {
    console.log("[getSoundCloudAccessToken] Using cached access token");
    return cachedToken.token;
  }

  console.log("[getSoundCloudAccessToken] Requesting access token...");

  const tokenUrl = "https://api.soundcloud.com/oauth2/token";
  try {
    const response = await fetch(tokenUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${btoa(`${clientId}:${clientSecret}`)}`,
      },
      body: "grant_type=client_credentials",
    });

    console.log(
      `[getSoundCloudAccessToken] Token response status: ${response.status} ${response.statusText}`,
    );

    if (!response.ok) {
      const errorBody = await response
        .text()
        .catch(() => "Unable to read error response");
      console.error("[getSoundCloudAccessToken] Failed to get access token:", {
        status: response.status,
        statusText: response.statusText,
        body: errorBody,
      });
      throw new Error(
        `Failed to get SoundCloud access token: ${response.statusText}`,
      );
    }

    const rawData = await response.json();

    // Validate the token response structure
    try {
      const tokenData = SoundCloudTokenResponseSchema.parse(rawData);
      console.log(
        "[getSoundCloudAccessToken] Successfully obtained and validated access token",
      );
      const token = tokenData.access_token;
      const expiresIn = tokenData.expires_in || 60; // Default to 1 minute if not provided
      const expiresAt = Date.now() + expiresIn * 1000;

      // Cache the token
      cachedToken = { token, expiresAt, refreshToken: tokenData.refresh_token };
      return token;
    } catch (validationError) {
      console.error(
        "[getSoundCloudAccessToken] Invalid token response format:",
        {
          error: validationError,
          rawData: JSON.stringify(rawData).slice(0, 200) + "...",
        },
      );
      throw new Error("Invalid access token response from SoundCloud");
    }
  } catch (error) {
    console.error("[getSoundCloudAccessToken] Error obtaining access token:", {
      error,
    });
    throw error;
  }
}
