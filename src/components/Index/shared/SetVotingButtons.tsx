import { Button } from "@/components/ui/button";
import { Star, Heart, X } from "lucide-react";

interface SetVotingButtonsProps {
  userVote?: number;
  votingLoading?: boolean;
  onVote: (voteType: number) => void;
  getVoteCount: (voteType: number) => number;
  size?: "sm" | "default";
  layout?: "horizontal" | "vertical";
}

export function SetVotingButtons({
  userVote,
  votingLoading,
  onVote,
  getVoteCount,
  size = "default",
  layout = "vertical",
}: SetVotingButtonsProps) {
  const containerClass =
    layout === "horizontal" ? "flex items-center gap-2" : "space-y-3";

  const buttonClass = layout === "horizontal" ? "" : "flex-1";

  return (
    <div className={containerClass}>
      <div className="flex items-center gap-2">
        <Button
          variant={userVote === 2 ? "default" : "outline"}
          size={size}
          onClick={() => onVote(2)}
          disabled={votingLoading}
          className={`${buttonClass} ${
            userVote === 2
              ? "bg-orange-600 hover:bg-orange-700"
              : "border-orange-400 text-orange-400 hover:bg-orange-400 hover:text-white"
          }`}
          title="Must go"
        >
          <Star className="h-4 w-4 mr-2" />
          {layout === "horizontal"
            ? getVoteCount(2)
            : `Must go (${getVoteCount(2)})`}
        </Button>
        {votingLoading && (
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-orange-400 border-t-transparent" />
        )}
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant={userVote === 1 ? "default" : "outline"}
          size={size}
          onClick={() => onVote(1)}
          disabled={votingLoading}
          className={`${buttonClass} ${
            userVote === 1
              ? "bg-blue-600 hover:bg-blue-700"
              : "border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-white"
          }`}
          title="Interested"
        >
          <Heart className="h-4 w-4 mr-2" />
          {layout === "horizontal"
            ? getVoteCount(1)
            : `Interested (${getVoteCount(1)})`}
        </Button>
        {votingLoading && (
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-blue-400 border-t-transparent" />
        )}
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant={userVote === -1 ? "default" : "outline"}
          size={size}
          onClick={() => onVote(-1)}
          disabled={votingLoading}
          className={`${buttonClass} ${
            userVote === -1
              ? "bg-gray-600 hover:bg-gray-700"
              : "border-gray-400 text-gray-400 hover:bg-gray-400 hover:text-white"
          }`}
          title="Won't go"
        >
          <X className="h-4 w-4 mr-2" />
          {layout === "horizontal"
            ? getVoteCount(-1)
            : `Won't go (${getVoteCount(-1)})`}
        </Button>
        {votingLoading && (
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-400 border-t-transparent" />
        )}
      </div>
    </div>
  );
}
