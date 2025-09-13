import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

// SoundCloud API response types
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

interface UseArtistSoundcloudPlaylistOptions {
  soundcloudUrl: string;
  enabled?: boolean;
}

async function fetchArtistPlaylist(
  soundcloudUrl: string,
): Promise<SoundCloudPlaylist> {
  console.log(
    "[fetchArtistPlaylist] Calling edge function for:",
    soundcloudUrl,
  );

  const { data, error } = await supabase.functions.invoke(
    "get-artist-soundcloud-playlist",
    {
      body: { url: soundcloudUrl },
    },
  );

  if (error) {
    console.error("[fetchArtistPlaylist] Edge function error:", error);
    throw new Error(error.message || "Failed to fetch playlist");
  }

  if (!data?.playlist) {
    console.error("[fetchArtistPlaylist] No playlist in response:", data);
    throw new Error("No playlist found in response");
  }

  console.log("[fetchArtistPlaylist] Received playlist:", data.playlist.title);
  return data.playlist;
}

export function useArtistSoundcloudPlaylist({
  soundcloudUrl,
  enabled = true,
}: UseArtistSoundcloudPlaylistOptions) {
  console.log("[useArtistSoundcloudPlaylist] Hook called with:", {
    soundcloudUrl,
    enabled,
  });

  return useQuery({
    queryKey: ["soundcloud-playlist", soundcloudUrl],
    queryFn: () => fetchArtistPlaylist(soundcloudUrl),
    enabled: enabled && Boolean(soundcloudUrl),
  });
}
