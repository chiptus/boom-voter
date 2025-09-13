import { useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

type SyncResponse = {
  message: string;
  artistsToProcess: number;
  startedAt: string;
};

async function syncSoundCloudData(): Promise<SyncResponse> {
  const { data, error } = await supabase.functions.invoke("sync-artist-data", {
    body: {},
  });

  if (error) {
    throw new Error(error.message || "Failed to start SoundCloud sync");
  }

  return data;
}

export function useSyncSoundCloudDataMutation() {
  return useMutation({
    mutationFn: syncSoundCloudData,
    onSuccess: (data) => {
      toast.success(
        `SoundCloud sync started! Processing ${data.artistsToProcess} artists.`,
        {
          description:
            "The sync is running in the background. Check back in a few minutes.",
          duration: 5000,
        },
      );
    },
    onError: (error) => {
      toast.error("Failed to start SoundCloud sync", {
        description: error.message,
      });
    },
  });
}
