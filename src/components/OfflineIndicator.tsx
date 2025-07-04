import { Wifi, WifiOff, Cloud, CloudOff, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useOnlineStatus, useOfflineQueue } from "@/hooks/useOffline";

export const OfflineIndicator = () => {
  const isOnline = useOnlineStatus();
  const { queueSize, syncing, syncQueue } = useOfflineQueue();

  if (isOnline && queueSize === 0) {
    return (
      <div className="flex items-center gap-2 text-green-400">
        <Wifi className="h-4 w-4" />
        <span className="text-sm">Online</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      {!isOnline ? (
        <>
          <WifiOff className="h-4 w-4 text-orange-400" />
          <span className="text-sm text-orange-400">Offline</span>
        </>
      ) : (
        <>
          <Wifi className="h-4 w-4 text-green-400" />
          <span className="text-sm text-green-400">Online</span>
        </>
      )}
      
      {queueSize > 0 && (
        <>
          <Badge variant="secondary" className="bg-orange-500/20 text-orange-300 border-orange-400/30">
            {queueSize} pending
          </Badge>
          
          {isOnline && (
            <Button
              size="sm"
              variant="outline"
              onClick={syncQueue}
              disabled={syncing}
              className="border-purple-400/50 text-purple-200 hover:bg-purple-600/50"
            >
              {syncing ? (
                <>
                  <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                  Syncing...
                </>
              ) : (
                <>
                  <Cloud className="h-3 w-3 mr-1" />
                  Sync
                </>
              )}
            </Button>
          )}
        </>
      )}
      
      {!isOnline && queueSize > 0 && (
        <div className="flex items-center gap-1 text-orange-400">
          <CloudOff className="h-3 w-3" />
          <span className="text-xs">Will sync when online</span>
        </div>
      )}
    </div>
  );
};