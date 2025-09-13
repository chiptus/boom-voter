import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

// SoundCloud API types
interface SoundCloudUser {
  id: number;
  username: string;
  permalink_url: string;
}

interface SoundCloudPlaylist {
  id: number;
  title: string;
  description: string | null;
  permalink_url: string;
  artwork_url: string | null;
  user: SoundCloudUser;
  track_count: number;
  tracks?: SoundCloudTrack[];
  likes_count?: number;
  reposts_count?: number;
  created_at: string;
}

interface SoundCloudTrack {
  id: number;
  title: string;
  permalink_url: string;
  stream_url?: string;
  duration: number;
  artwork_url: string | null;
}

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

async function getSoundCloudAccessToken(
  clientId: string,
  clientSecret: string,
): Promise<string> {
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
    throw new Error(`Failed to get access token: ${response.statusText}`);
  }

  const data = await response.json();
  return data.access_token;
}

async function fetchSoundCloudAPI(endpoint: string, accessToken: string) {
  const response = await fetch(`https://api.soundcloud.com${endpoint}`, {
    headers: {
      Authorization: `OAuth ${accessToken}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(
      `SoundCloud API error: ${response.status} ${response.statusText}`,
    );
  }

  return response.json();
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { url: soundcloudUrl } = await req.json();
    if (!soundcloudUrl) {
      return new Response(
        JSON.stringify({ error: "Missing soundcloud URL parameter" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    // Get SoundCloud credentials from environment
    const clientId = Deno.env.get("SOUNDCLOUD_CLIENT_ID");
    const clientSecret = Deno.env.get("SOUNDCLOUD_CLIENT_SECRET");

    if (!clientId || !clientSecret) {
      return new Response(
        JSON.stringify({ error: "SoundCloud credentials not configured" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    console.log("Getting SoundCloud access token...");
    const accessToken = await getSoundCloudAccessToken(clientId, clientSecret);

    console.log("Resolving SoundCloud URL:", soundcloudUrl);
    // First resolve the URL to get user info
    const resolveEndpoint = `/resolve?url=${encodeURIComponent(soundcloudUrl)}`;
    const resolvedUser = (await fetchSoundCloudAPI(
      resolveEndpoint,
      accessToken,
    )) as SoundCloudUser;

    if (!resolvedUser || !resolvedUser.id) {
      return new Response(
        JSON.stringify({ error: "Could not resolve SoundCloud user" }),
        {
          status: 404,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    console.log(
      `Resolved user: ${resolvedUser.username} (ID: ${resolvedUser.id})`,
    );

    // Fetch user's playlists
    console.log("Fetching user playlists...");
    const playlistsEndpoint = `/users/${resolvedUser.id}/playlists?limit=20`;
    const playlists = (await fetchSoundCloudAPI(
      playlistsEndpoint,
      accessToken,
    )) as SoundCloudPlaylist[];

    console.log(`Found ${playlists?.length || 0} playlists`);

    if (!playlists || playlists.length === 0) {
      // Fallback: get user's tracks instead
      console.log("No playlists found, fetching user tracks...");
      const tracksEndpoint = `/users/${resolvedUser.id}/tracks?limit=10`;
      const tracks = (await fetchSoundCloudAPI(
        tracksEndpoint,
        accessToken,
      )) as SoundCloudTrack[];

      if (tracks && tracks.length > 0) {
        // Return a virtual playlist from user's tracks
        const virtualPlaylist = {
          id: -1,
          title: `${resolvedUser.username}'s Tracks`,
          description: `Top tracks by ${resolvedUser.username}`,
          permalink_url: resolvedUser.permalink_url,
          artwork_url: tracks[0]?.artwork_url || null,
          user: resolvedUser,
          track_count: tracks.length,
          tracks: tracks.slice(0, 5), // Limit to top 5 tracks
          created_at: new Date().toISOString(),
        };

        return new Response(JSON.stringify({ playlist: virtualPlaylist }), {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      return new Response(
        JSON.stringify({
          error: "No playlists or tracks found for this artist",
        }),
        {
          status: 404,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    // Sort playlists to find the "best" one
    // Priority: most likes, then most tracks, then most recent
    const bestPlaylist = playlists
      .filter((playlist) => playlist.track_count > 0) // Only playlists with tracks
      .sort((a, b) => {
        // First priority: likes count
        const aLikes = a.likes_count || 0;
        const bLikes = b.likes_count || 0;
        if (aLikes !== bLikes) {
          return bLikes - aLikes;
        }

        // Second priority: track count
        if (a.track_count !== b.track_count) {
          return b.track_count - a.track_count;
        }

        // Third priority: most recent
        return (
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
      })[0];

    if (!bestPlaylist) {
      return new Response(
        JSON.stringify({ error: "No suitable playlist found" }),
        {
          status: 404,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    console.log(
      `Returning best playlist: ${bestPlaylist.title} (${bestPlaylist.track_count} tracks)`,
    );

    return new Response(JSON.stringify({ playlist: bestPlaylist }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in get-artist-soundcloud-playlist function:", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return new Response(
      JSON.stringify({
        error: "Internal server error",
        details: errorMessage,
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  }
});
