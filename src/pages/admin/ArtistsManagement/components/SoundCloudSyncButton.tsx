import { Button } from "@/components/ui/button";
import { Music, Loader2 } from "lucide-react";
import { useSyncSoundCloudDataMutation } from "@/hooks/mutations/useSyncSoundCloudDataMutation";

interface SoundCloudSyncButtonProps {
  className?: string;
}

export function SoundCloudSyncButton({ className }: SoundCloudSyncButtonProps) {
  const syncMutation = useSyncSoundCloudDataMutation();

  function handleSync() {
    syncMutation.mutate();
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleSync}
      disabled={syncMutation.isPending}
      className={className}
    >
      {syncMutation.isPending ? (
        <Loader2 className="h-3 w-3 mr-1 animate-spin" />
      ) : (
        <Music className="h-3 w-3 mr-1" />
      )}

      <span className="hidden md:block">
        {syncMutation.isPending ? "Syncing..." : "Sync SoundCloud"}
      </span>
    </Button>
  );
}
