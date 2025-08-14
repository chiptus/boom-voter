import { Button } from "@/components/ui/button";
import { VOTE_CONFIG, VOTES_TYPES } from "@/lib/voteConfig";
import { useFestivalSet } from "../FestivalSetContext";

interface SetVotingButtonsProps {
  size?: "sm" | "default";
  layout?: "horizontal" | "vertical";
}

export function SetVotingButtons({
  size = "default",
  layout = "vertical",
}: SetVotingButtonsProps) {
  const { set, userVote, votingLoading, onVote, onAuthRequired, getVoteCount } =
    useFestivalSet();

  async function handleVote(voteType: number) {
    const result = await onVote(set.id, voteType);
    if (result.requiresAuth) {
      onAuthRequired();
    }
  }
  const containerClass =
    layout === "horizontal" ? "flex items-center gap-2" : "space-y-3";

  const buttonClass = layout === "horizontal" ? "" : "flex-1";

  const voteButtons = VOTES_TYPES.map((voteType) => ({
    config: VOTE_CONFIG[voteType],
    vote: VOTE_CONFIG[voteType].value,
  }));

  return (
    <div className={containerClass}>
      {voteButtons.map(({ config, vote }) => {
        const IconComponent = config.icon;
        const isSelected = userVote === vote;

        return (
          <div key={vote} className="flex items-center gap-2">
            <Button
              variant={isSelected ? "default" : "outline"}
              size={size}
              onClick={() => handleVote(vote)}
              disabled={votingLoading}
              className={`${buttonClass} ${
                isSelected ? config.buttonSelected : config.buttonUnselected
              }`}
              title={config.label}
            >
              <IconComponent className="h-4 w-4 mr-2" />
              {layout === "horizontal"
                ? getVoteCount(vote)
                : `${config.label} (${getVoteCount(vote)})`}
            </Button>
            {votingLoading && (
              <div
                className={`h-4 w-4 animate-spin rounded-full border-2 ${config.spinnerColor} border-t-transparent`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
