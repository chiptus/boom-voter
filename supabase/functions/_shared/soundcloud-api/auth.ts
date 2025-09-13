import { SoundCloudTokenResponseSchema } from "./schemas.ts";

export async function getSoundCloudAccessToken(
  clientId: string,
  clientSecret: string,
): Promise<string> {
  console.log("[getSoundCloudAccessToken] Requesting access token...");

  const tokenUrl = "https://api.soundcloud.com/oauth2/token";

  const response = await fetch(tokenUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${btoa(`${clientId}:${clientSecret}`)}`,
    },
    body: "grant_type=client_credentials",
  });

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
    return tokenData.access_token;
  } catch (validationError) {
    console.error("[getSoundCloudAccessToken] Invalid token response format:", {
      error: validationError,
      rawData: JSON.stringify(rawData).slice(0, 200) + "...",
    });
    throw new Error("Invalid access token response from SoundCloud");
  }
}
