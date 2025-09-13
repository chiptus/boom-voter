import { SupabaseClient } from "https://esm.sh/@supabase/supabase-js@2";
import { getArtistDataFromAPI } from "./soundcloud-api.ts";
import { isSoundCloudAPIError } from "../_shared/soundcloud-api/errors.ts";

export type Artist = {
  id: string;
  name: string;
  soundcloud_url?: string;
  image_url?: string;
};

export type UpdateData = {
  // Artist table updates
  image_url?: string;

  // SoundCloud table data
  artist_id: string;
  soundcloud_url: string;
  soundcloud_id?: number;
  username?: string;
  display_name?: string;
  followers_count?: number;
  playlist_url?: string;
  playlist_title?: string;
  last_sync: string;
};

export type SyncResults = {
  processed: number;
  updated: number;
  failed: number;
  errors: string[];
  startedAt: string;
  completedAt: string | null;
};

export async function processSoundCloudArtists(
  supabase: SupabaseClient,
  artists: Artist[],
): Promise<SyncResults> {
  const results: SyncResults = {
    processed: 0,
    updated: 0,
    failed: 0,
    errors: [],
    startedAt: new Date().toISOString(),
    completedAt: null,
  };

  console.log(`Background job processing ${artists.length} artists...`);

  if (artists.length === 0) {
    console.log("No artists to process");
    return results;
  }

  // Process each artist
  for (const artist of artists) {
    try {
      results.processed++;
      console.log(
        `Processing artist ${results.processed}/${artists.length}: ${artist.name}`,
      );

      const soundcloudUrl = artist.soundcloud_url;

      if (!soundcloudUrl || !soundcloudUrl.includes("soundcloud.com/")) {
        console.warn(
          `Invalid SoundCloud URL for ${artist.name}: ${soundcloudUrl}`,
        );
        results.failed++;
        results.errors.push(`Invalid URL format for ${artist.name}`);
        continue;
      }

      const updateData = await processArtistData(artist, soundcloudUrl);

      // Upsert SoundCloud data
      const { error: soundCloudError } = await supabase
        .from("soundcloud")
        .upsert(
          {
            artist_id: artist.id,
            username: updateData.username || null,
            display_name: updateData.display_name || null,
            followers_count: updateData.followers_count || 0,
            playlist_url: updateData.playlist_url || null,
            playlist_title: updateData.playlist_title || null,
            soundcloud_url: updateData.soundcloud_url,
            last_sync: updateData.last_sync,
          },
          {
            onConflict: "artist_id",
            ignoreDuplicates: false,
          },
        );

      if (soundCloudError) {
        console.error(
          `Error updating SoundCloud data for ${artist.name}:`,
          soundCloudError,
        );
        results.failed++;
        results.errors.push(
          `SoundCloud update error for ${artist.name}: ${soundCloudError.message}`,
        );
        continue; // Continue with next artist instead of throwing
      }

      // Update artist data if needed (e.g., image_url)
      if (updateData.image_url) {
        const { error: artistUpdateError } = await supabase
          .from("artists")
          .update({ image_url: updateData.image_url })
          .eq("id", artist.id);

        if (artistUpdateError) {
          console.warn(
            `Warning: Failed to update artist data for ${artist.name}:`,
            artistUpdateError,
          );
          // Don't fail the sync for artist update errors
        }
      }

      results.updated++;
      console.log(`Successfully updated ${artist.name}`);

      // Rate limiting - be respectful to APIs
      await new Promise((resolve) => setTimeout(resolve, 2000));
    } catch (error) {
      console.error(`Error processing ${artist.name}:`, error);
      results.failed++;

      const errorMessage = isSoundCloudAPIError(error)
        ? error.message
        : (error as Error).message;
      results.errors.push(
        `Processing error for ${artist.name}: ${errorMessage}`,
      );

      // Only update sync timestamp on certain types of errors (not scraping failures)
      if (
        errorMessage.includes("Invalid URL format") ||
        errorMessage.includes("rate limit") ||
        errorMessage.includes("RATE_LIMIT_EXCEEDED")
      ) {
        try {
          await supabase
            .from("artists")
            .update({ last_soundcloud_sync: new Date().toISOString() })
            .eq("id", artist.id);
        } catch (syncError) {
          console.error(
            `Failed to update sync timestamp for ${artist.name}:`,
            syncError,
          );
        }
      }
    }
  }

  results.completedAt = new Date().toISOString();
  console.log("Background job completed:", results);

  return results;
}

async function processArtistData(
  artist: Artist,
  soundcloudUrl: string,
): Promise<UpdateData> {
  console.log(`Processing data for ${artist.name} from SoundCloud API...`);

  const updateData: UpdateData = {
    artist_id: artist.id,
    soundcloud_url: soundcloudUrl,
    last_sync: new Date().toISOString(),
  };

  try {
    // Get all artist data from SoundCloud API
    const artistData = await getArtistDataFromAPI(soundcloudUrl);

    // Update SoundCloud user data
    updateData.soundcloud_id = artistData.user.id;
    updateData.username = artistData.user.username;
    updateData.display_name =
      artistData.user.display_name ||
      artistData.user.full_name ||
      artistData.user.username;
    updateData.followers_count = artistData.user.followers_count || 0;

    console.log(
      `Updated user data for ${artist.name}: ${updateData.followers_count} followers`,
    );

    // Update playlist data if found
    if (artistData.topPlaylist && artistData.topPlaylist.permalink_url) {
      updateData.playlist_url = artistData.topPlaylist.permalink_url;
      updateData.playlist_title = artistData.topPlaylist.title;
      console.log(
        `Found playlist for ${artist.name}: ${artistData.topPlaylist.title}`,
      );
    } else {
      console.log(`No playlist found for ${artist.name}`);
    }

    // Update artist image if we have a better one
    if (
      artistData.user.avatar_url &&
      (!artist.image_url || artistData.user.avatar_url.includes("t500x500"))
    ) {
      // Try to get higher resolution image
      let highResUrl = artistData.user.avatar_url;
      if (highResUrl.includes("large.jpg")) {
        highResUrl = highResUrl.replace("large.jpg", "t500x500.jpg");
      } else if (highResUrl.includes("crop")) {
        // SoundCloud sometimes uses crop parameter, try to get original
        highResUrl = highResUrl.replace(/crop.*?\.jpg/, "t500x500.jpg");
      }
      updateData.image_url = highResUrl;
      console.log(`Updated image for ${artist.name}`);
    }
    return updateData;
  } catch (apiError) {
    console.error(`SoundCloud API failed for ${artist.name}:`, apiError);
    throw apiError;
  }
}
