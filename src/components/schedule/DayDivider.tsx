import { Separator } from "@/components/ui/separator";
import { Calendar } from "lucide-react";

interface DayDividerProps {
  displayDate: string;
  isFirst?: boolean;
}

export const DayDivider = ({ displayDate, isFirst = false }: DayDividerProps) => {
  return (
    <div className={`py-6 ${!isFirst ? 'mt-8' : ''}`}>
      <div className="flex items-center gap-4 mb-6">
        <Calendar className="h-5 w-5 text-purple-400" />
        <h2 className="text-2xl font-bold text-white">{displayDate}</h2>
        <div className="flex-1">
          <Separator className="bg-purple-400/30" />
        </div>
      </div>
    </div>
  );
};