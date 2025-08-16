import { Button } from "@/components/ui/button";
import { VOTE_CONFIG, VOTES_TYPES } from "@/lib/voteConfig";

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
  const voteButtons = VOTES_TYPES.map((voteType) => ({
    config: VOTE_CONFIG[voteType],
    vote: VOTE_CONFIG[voteType].value,
  }));

  return (
    <div className="flex items-center gap-4 mb-6">
      {voteButtons.map(({ config, vote }) => {
        const IconComponent = config.icon;
        const isSelected = userVote === vote;

        return (
          <Button
            key={vote}
            variant={isSelected ? "default" : "outline"}
            onClick={() => onVote(vote)}
            className={
              isSelected ? config.buttonSelected : config.buttonUnselected
            }
          >
            <IconComponent className="h-4 w-4 mr-1" />
            {config.label} ({getVoteCount(vote)})
          </Button>
        );
      })}
    </div>
  );
}
