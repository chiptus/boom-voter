import {
  SoundCloudPlaylist,
  SoundCloudUser,
  SoundCloudTrack,
  SoundCloudPlaylistArraySchema,
  SoundCloudTrackArraySchema,
} from "./schemas.ts";
import { fetchSoundCloudAPI } from "./api.ts";

export async function getArtistPlaylists(
  resolvedUser: SoundCloudUser,
  accessToken: string,
): Promise<SoundCloudPlaylist[]> {
  console.log("Fetching user playlists...");
  const playlistsEndpoint = `/users/${resolvedUser.id}/playlists?limit=20`;
  const playlists = await fetchSoundCloudAPI(
    playlistsEndpoint,
    accessToken,
    SoundCloudPlaylistArraySchema,
  );

  console.log(`Found ${playlists?.length || 0} playlists`);
  return playlists;
}

export async function getArtistTracks(
  resolvedUser: SoundCloudUser,
  accessToken: string,
): Promise<SoundCloudTrack[]> {
  console.log("No playlists found, fetching user tracks...");
  const tracksEndpoint = `/users/${resolvedUser.id}/tracks?limit=10`;
  const tracks = await fetchSoundCloudAPI(
    tracksEndpoint,
    accessToken,
    SoundCloudTrackArraySchema,
  );

  return tracks;
}

export function createVirtualPlaylistFromTracks(
  resolvedUser: SoundCloudUser,
  tracks: SoundCloudTrack[],
): SoundCloudPlaylist {
  return {
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
}

export function selectBestPlaylist(
  playlists: SoundCloudPlaylist[],
): SoundCloudPlaylist | null {
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

  return bestPlaylist || null;
}
