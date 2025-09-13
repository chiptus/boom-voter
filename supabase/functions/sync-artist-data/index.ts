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
        image_url,
        soundcloud:soundcloud(last_sync)
      `,
      )
      .not("soundcloud_url", "is", null)
      .or(
        "soundcloud.last_sync.is.null,soundcloud.last_sync.lt." +
          new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString() +
          ",soundcloud.is.null",
      )
      .order("soundcloud.last_sync", { ascending: true, nullsFirst: true });

    if (fetchError) {
      console.error("Error fetching artists:", fetchError);
      throw new Error("Failed to fetch artists");
    }

    const artistCount = artists?.length || 0;
    console.log(`Found ${artistCount} artists to sync`);

    // Use EdgeRuntime.waitUntil to ensure background job completes
    if (typeof EdgeRuntime !== "undefined" && EdgeRuntime.waitUntil) {
      EdgeRuntime.waitUntil(processSoundCloudArtists(supabase, artists || []));
    } else {
      // Fallback: run in background without waitUntil
      processSoundCloudArtists(supabase, artists || []).catch((error) => {
        console.error("Background processing failed:", error);
      });
    }

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
