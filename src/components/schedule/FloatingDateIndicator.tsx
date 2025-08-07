import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "lucide-react";

interface FloatingDateIndicatorProps {
  currentDate: string;
  visible: boolean;
}

export const FloatingDateIndicator = ({
  currentDate,
  visible,
}: FloatingDateIndicatorProps) => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    setShow(visible);
  }, [visible]);

  if (!show || !currentDate) return null;

  return (
    <div className="sticky top-0 left-0 right-0 z-50 bg-gradient-to-r from-purple-900/90 to-blue-900/90 backdrop-blur-md border-b border-purple-400/30 py-3">
      <div className="container mx-auto px-4 flex justify-center">
        <Badge
          variant="secondary"
          className="bg-white/10 text-white border-purple-400/50 px-4 py-2 text-sm font-medium"
        >
          <Calendar className="h-4 w-4 mr-2" />
          {currentDate}
        </Badge>
      </div>
    </div>
  );
};
