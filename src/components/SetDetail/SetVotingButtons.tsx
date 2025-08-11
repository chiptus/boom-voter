import { Button } from "@/components/ui/button";
import { Star, Heart, X } from "lucide-react";

interface ArtistVotingButtonsProps {
  userVote: number | null;
  onVote: (voteType: number) => void;
  getVoteCount: (voteType: number) => number;
}

export function ArtistVotingButtons({
  userVote,
  onVote,
  getVoteCount,
}: ArtistVotingButtonsProps) {
  return (
    <div className="flex items-center gap-4 mb-6">
      <Button
        variant={userVote === 2 ? "default" : "outline"}
        onClick={() => onVote(2)}
        className={
          userVote === 2
            ? "bg-orange-600 hover:bg-orange-700"
            : "border-orange-400 text-orange-400 hover:bg-orange-400 hover:text-white"
        }
      >
        <Star className="h-4 w-4 mr-1" />
        Must go ({getVoteCount(2)})
      </Button>
      <Button
        variant={userVote === 1 ? "default" : "outline"}
        onClick={() => onVote(1)}
        className={
          userVote === 1
            ? "bg-blue-600 hover:bg-blue-700"
            : "border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-white"
        }
      >
        <Heart className="h-4 w-4 mr-1" />
        Interested ({getVoteCount(1)})
      </Button>
      <Button
        variant={userVote === -1 ? "default" : "outline"}
        onClick={() => onVote(-1)}
        className={
          userVote === -1
            ? "bg-gray-600 hover:bg-gray-700"
            : "border-gray-400 text-gray-400 hover:bg-gray-400 hover:text-white"
        }
      >
        <X className="h-4 w-4 mr-1" />
        Won't go ({getVoteCount(-1)})
      </Button>
    </div>
  );
}
