
import { Heart, Music } from "lucide-react";

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
      <p className="text-sm text-purple-300 mt-2">
        {artistCount} artists available for voting
      </p>
    </div>
  );
};
