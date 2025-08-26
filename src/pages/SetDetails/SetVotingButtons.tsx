import { Button } from "@/components/ui/button";
import { VOTE_CONFIG, getVoteConfig } from "@/lib/voteConfig";

interface VoteButtonProps {
  voteType: number;
  isActive: boolean;
  onClick: () => void;
  count: number;
}

function VoteButton({ voteType, isActive, onClick, count }: VoteButtonProps) {
  const configKey = getVoteConfig(voteType);
  if (!configKey) return null;

  const config = VOTE_CONFIG[configKey];
  const IconComponent = config.icon;

  return (
    <Button
      variant={isActive ? "default" : "outline"}
      onClick={onClick}
      className={isActive ? config.buttonSelected : config.buttonUnselected}
      title={config.label}
    >
      <IconComponent className="h-4 w-4 mr-1" />
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
