import { SupabaseClient } from "https://esm.sh/@supabase/supabase-js@2";
import { getArtistDataFromAPI } from "./soundcloud-api.ts";
import { isSoundCloudAPIError } from "../_shared/soundcloud-api/errors.ts";

export type Artist = {
  id: string;
  name: string;
  soundcloud_url?: string;
  image_url?: string;
  last_soundcloud_sync?: string;
  soundcloud_followers?: number;
  soundcloud_playlist_url?: string;
};

export type UpdateData = {
  last_soundcloud_sync: string;
  soundcloud_followers?: number;
  image_url?: string;
  soundcloud_playlist_url?: string;
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

      const { error: updateError } = await supabase
        .from("artists")
        .update(updateData)
        .eq("id", artist.id);

      if (updateError) {
        console.error(`Error updating ${artist.name}:`, updateError);
        results.failed++;
        results.errors.push(
          `Update error for ${artist.name}: ${updateError.message}`,
        );
        throw new Error(
          `Failed to update artist ${artist.name}: ${updateError.message}`,
        );
      } else {
        results.updated++;
        console.log(`Successfully updated ${artist.name}`);
      }

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
    last_soundcloud_sync: new Date().toISOString(),
  };

  try {
    // Get all artist data from SoundCloud API
    const artistData = await getArtistDataFromAPI(soundcloudUrl);

    // Update playlist URL if found
    if (artistData.topPlaylist && artistData.topPlaylist.permalink_url) {
      updateData.soundcloud_playlist_url = artistData.topPlaylist.permalink_url;
      console.log(
        `Found playlist for ${artist.name}: ${artistData.topPlaylist.title}`,
      );
    } else {
      console.log(`No playlist found for ${artist.name}`);
    }

    // Update followers count from user data
    if (
      artistData.user.followers_count !== undefined &&
      artistData.user.followers_count > 0
    ) {
      updateData.soundcloud_followers = artistData.user.followers_count;
      console.log(
        `Updated followers for ${artist.name}: ${artistData.user.followers_count}`,
      );
    }

    // Update avatar image from user data
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
  } catch (apiError) {
    console.error(`SoundCloud API failed for ${artist.name}:`, apiError);
    throw apiError;
  }

  return updateData;
}
