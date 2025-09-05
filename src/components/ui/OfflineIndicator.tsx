import { useOnlineStatus } from "@/hooks/useOnlineStatus";
import { Badge } from "@/components/ui/badge";
import { WifiOff } from "lucide-react";

export function OfflineIndicator() {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <Badge variant="destructive" className="fixed top-4 right-4 z-50 gap-1">
      <WifiOff size={12} />
      Offline
    </Badge>
  );
}
