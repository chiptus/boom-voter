import { Button } from "@/components/ui/button";
import { Star, Heart, X } from "lucide-react";

type VoteType = 2 | 1 | -1;

interface VoteConfig {
  icon: React.ReactNode;
  label: string;
  activeClass: string;
  inactiveClass: string;
}

const VOTE_CONFIGS: Record<string, VoteConfig> = {
  "2": {
    icon: <Star className="h-4 w-4 mr-1" />,
    label: "Must go",
    activeClass: "bg-orange-600 hover:bg-orange-700",
    inactiveClass:
      "border-orange-400 text-orange-400 hover:bg-orange-400 hover:text-white",
  },
  "1": {
    icon: <Heart className="h-4 w-4 mr-1" />,
    label: "Interested",
    activeClass: "bg-blue-600 hover:bg-blue-700",
    inactiveClass:
      "border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-white",
  },
  "-1": {
    icon: <X className="h-4 w-4 mr-1" />,
    label: "Won't go",
    activeClass: "bg-gray-600 hover:bg-gray-700",
    inactiveClass:
      "border-gray-400 text-gray-400 hover:bg-gray-400 hover:text-white",
  },
};

interface VoteButtonProps {
  voteType: VoteType;
  isActive: boolean;
  onClick: () => void;
  count: number;
}

function VoteButton({ voteType, isActive, onClick, count }: VoteButtonProps) {
  const config = VOTE_CONFIGS[voteType.toString()];

  return (
    <Button
      variant={isActive ? "default" : "outline"}
      onClick={onClick}
      className={isActive ? config.activeClass : config.inactiveClass}
      title={config.label}
    >
      {config.icon}
      <span className="hidden sm:inline">
        {config.label} ({count})
      </span>
      <span className="sm:hidden">{count}</span>
    </Button>
  );
}

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
      <VoteButton
        voteType={2}
        isActive={userVote === 2}
        onClick={() => onVote(2)}
        count={getVoteCount(2)}
      />
      <VoteButton
        voteType={1}
        isActive={userVote === 1}
        onClick={() => onVote(1)}
        count={getVoteCount(1)}
      />
      <VoteButton
        voteType={-1}
        isActive={userVote === -1}
        onClick={() => onVote(-1)}
        count={getVoteCount(-1)}
      />
    </div>
  );
}
