import { Button } from "@/components/ui/button";
import { Clock } from "lucide-react";

interface ScrollToNowProps {
  onClick: () => void;
  visible?: boolean;
}

export const ScrollToNow = ({ onClick, visible = true }: ScrollToNowProps) => {
  if (!visible) return null;

  return (
    <Button
      onClick={onClick}
      className="fixed bottom-20 right-4 z-50 rounded-full h-12 w-12 p-0 bg-purple-600 hover:bg-purple-700 shadow-lg border border-purple-400/50"
      aria-label="Scroll to current time"
    >
      <Clock className="h-5 w-5" />
    </Button>
  );
};