import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "lucide-react";

interface FloatingDateIndicatorProps {
  currentDate: string;
  visible: boolean;
}

export const FloatingDateIndicator = ({ currentDate, visible }: FloatingDateIndicatorProps) => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    setShow(visible);
  }, [visible]);

  if (!show || !currentDate) return null;

  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 transition-all duration-300">
      <Badge 
        variant="secondary" 
        className="bg-purple-900/90 backdrop-blur-md text-white border-purple-400/50 px-4 py-2 text-sm font-medium shadow-lg"
      >
        <Calendar className="h-4 w-4 mr-2" />
        {currentDate}
      </Badge>
    </div>
  );
};