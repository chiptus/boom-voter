
import { Heart, Music } from "lucide-react";

interface FestivalHeaderProps {
  artistCount: number;
}

export const FestivalHeader = ({ artistCount }: FestivalHeaderProps) => {
  return (
    <div className="text-center mb-8">
      <div className="flex items-center justify-center gap-2 mb-4">
        <Music className="h-8 w-8 text-orange-500" />
        <h1 className="text-4xl font-bold text-orange-100 drop-shadow-lg">Boom Festival</h1>
        <Heart className="h-8 w-8 text-orange-400" />
      </div>
      <p className="text-xl text-orange-200">Vote for your favorite artists!</p>
      <p className="text-sm text-orange-300 mt-2">
        {artistCount} artists available for voting
      </p>
    </div>
  );
};
