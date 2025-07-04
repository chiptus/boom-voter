
import { Heart, Music, Calendar } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface FestivalHeaderProps {
  artistCount: number;
}

export const FestivalHeader = ({ artistCount }: FestivalHeaderProps) => {
  return (
    <div className="text-center mb-8">
      <div className="flex items-center justify-center gap-2 mb-4">
        <Music className="h-8 w-8 text-purple-400" />
        <h1 className="text-4xl font-bold text-white">Boom Festival</h1>
        <Heart className="h-8 w-8 text-pink-400" />
      </div>
      <p className="text-xl text-purple-200">Vote for your favorite artists!</p>
      <p className="text-sm text-purple-300 mt-2 mb-4">
        {artistCount} artists available for voting
      </p>
      
      <div className="flex justify-center">
        <Link to="/schedule">
          <Button 
            variant="outline" 
            className="border-purple-400 text-purple-400 hover:bg-purple-400 hover:text-white"
          >
            <Calendar className="h-4 w-4 mr-2" />
            View Schedule
          </Button>
        </Link>
      </div>
    </div>
  );
};
