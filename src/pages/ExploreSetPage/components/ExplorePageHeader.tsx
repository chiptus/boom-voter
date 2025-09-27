import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Info } from "lucide-react";
import { ExplorationProgress } from "../ExplorationProgress";

interface ExplorePageHeaderProps {
  basePath: string;
  editionName: string;
  currentIndex: number;
  totalSets: number;
}

export function ExplorePageHeader({
  basePath,
  editionName,
  currentIndex,
  totalSets,
}: ExplorePageHeaderProps) {
  return (
    <div className="relative z-10 p-4 flex items-center justify-between">
      <Link to={`${basePath}/sets`}>
        <Button
          asChild
          variant="ghost"
          size="sm"
          className="text-white hover:bg-white/20"
        >
          <div className="flex items-center">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </div>
        </Button>
      </Link>

      <div className="text-center text-white">
        <h1 className="font-semibold">{editionName}</h1>
        <ExplorationProgress current={currentIndex + 1} total={totalSets} />
      </div>

      <Button
        variant="ghost"
        size="sm"
        className="text-white hover:bg-white/20"
      >
        <Info className="h-4 w-4" />
      </Button>
    </div>
  );
}
