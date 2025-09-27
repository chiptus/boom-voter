import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { processSoundCloudArtists } from "./processor.ts";

// Declare EdgeRuntime for Supabase Edge Functions
declare const EdgeRuntime:
  | {
      waitUntil: (promise: Promise<unknown>) => void;
    }
  | undefined;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    );

    console.log("Starting SoundCloud artist data sync...");

    // Get artists with SoundCloud URLs that need syncing
    const { data: artists, error: fetchError } = await supabase
      .from("artists")
      .select(
        `
        id, 
        name, 
        soundcloud_url, 
        image_url
      `,
      )
      .not("soundcloud_url", "is", null);

    if (fetchError) {
      console.error("Error fetching artists:", { fetchError });
      throw new Error("Failed to fetch artists");
    }

    const { data: soundcloudData, error: scError } = await supabase
      .from("soundcloud")
      .select("*")
      .or(
        `last_sync.is.null,last_sync.lt.${new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()}`,
      )
      .order("last_sync", { ascending: true, nullsFirst: true })

      .in("artist_id", artists?.map((a) => a.id) || []);

    if (scError) {
      console.error("Error fetching soundcloud data:", scError);
      throw new Error("Failed to fetch soundcloud data for SoundCloud sync");
    }

    const artistCount = soundcloudData?.length || 0;
    console.log(`Found ${artistCount} artists to sync`);

    const artistsToProcess =
      soundcloudData
        ?.map((sc) => {
          const artist = artists?.find((a) => a.id === sc.artist_id);
          return artist
            ? {
                id: artist.id,
                name: artist.name,
                soundcloud_url: artist.soundcloud_url!,
              }
            : null;
        })
        .filter(
          (a): a is { id: string; name: string; soundcloud_url: string } =>
            a !== null,
        ) || [];

    // Use EdgeRuntime.waitUntil to ensure background job completes
    EdgeRuntime.waitUntil(
      processSoundCloudArtists(supabase, artistsToProcess || []),
    );

    // Return immediately with job started confirmation
    return new Response(
      JSON.stringify({
        message: "SoundCloud sync job started in background",
        artistsToProcess: artistCount,
        startedAt: new Date().toISOString(),
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 202, // Accepted - processing in background
      },
    );
  } catch (error) {
    console.error("Sync function error:", error);
    return new Response(
      JSON.stringify({
        error: (error as Error).message,
        message: "Failed to start SoundCloud sync job",
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  }
});
