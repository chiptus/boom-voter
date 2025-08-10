import { useToast } from "@/hooks/use-toast";
import { FestivalSet } from "@/services/queries";
import { SetHeader } from "./shared/SetHeader";
import { SetImage } from "./shared/SetImage";
import { SetMetadata } from "./shared/SetMetadata";
import { SetDescription } from "./shared/SetDescription";
import { SetVotingButtons } from "./shared/SetVotingButtons";

interface SingleArtistSetListItemProps {
  set: FestivalSet;
  userVote?: number;
  userKnowledge?: boolean;
  votingLoading?: boolean;
  onVote: (
    setId: string,
    voteType: number,
  ) => Promise<{ requiresAuth: boolean }>;
  onKnowledgeToggle: (setId: string) => Promise<{ requiresAuth: boolean }>;
  onAuthRequired: () => void;
  use24Hour?: boolean;
}

export function SingleArtistSetListItem({
  set,
  userVote,
  userKnowledge,
  votingLoading,
  onVote,
  onKnowledgeToggle,
  onAuthRequired,
  use24Hour = false,
}: SingleArtistSetListItemProps) {
  const { toast } = useToast();

  async function handleVote(voteType: number) {
    const result = await onVote(set.id, voteType);
    if (result.requiresAuth) {
      onAuthRequired();
    }
  }

  async function handleKnowledgeToggle() {
    const result = await onKnowledgeToggle(set.id);
    if (result.requiresAuth) {
      onAuthRequired();
    } else {
      const newKnowledgeState = !userKnowledge;
      toast({
        title: `${set.name} is ${newKnowledgeState ? "known" : "unknown"}`,
        duration: 2000,
      });
    }
  }

  function getVoteCount(voteType: number) {
    return set.votes.filter((vote) => vote.vote_type === voteType).length;
  }

  // Get social platform counts
  const socialPlatforms = {
    spotify: set.artists.filter((a) => a.spotify_url).length,
    soundcloud: set.artists.filter((a) => a.soundcloud_url).length,
  };

  return (
    <div
      className="bg-white/10 backdrop-blur-md border-purple-400/30 hover:bg-white/15 transition-all duration-300 rounded-lg p-4"
      data-testid="artist-item"
    >
      {/* Mobile Layout (sm and below) */}
      <div className="block md:hidden space-y-3">
        <div className="flex items-start gap-3 relative">
          <SetImage
            artists={set.artists}
            setName={set.name}
            setSlug={set.slug}
            size="sm"
          />
          <div className="flex-1 min-w-0">
            <SetHeader
              setName={set.name}
              userKnowledge={userKnowledge}
              onKnowledgeToggle={handleKnowledgeToggle}
              socialPlatforms={socialPlatforms}
              size="sm"
            />

            <SetMetadata set={set} use24Hour={use24Hour} />
          </div>
        </div>

        <SetDescription
          artists={set.artists}
          setDescription={set.description}
          className="text-purple-200 text-sm"
        />

        <SetVotingButtons
          userVote={userVote}
          votingLoading={votingLoading}
          onVote={handleVote}
          getVoteCount={getVoteCount}
          size="sm"
          layout="horizontal"
        />
      </div>

      {/* Desktop Layout (md and above) */}
      <div className="hidden md:flex items-center gap-4 relative">
        <SetImage
          artists={set.artists}
          setName={set.name}
          setSlug={set.slug}
          size="md"
        />

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1 min-w-0">
              <SetHeader
                setName={set.name}
                userKnowledge={userKnowledge}
                onKnowledgeToggle={handleKnowledgeToggle}
                socialPlatforms={socialPlatforms}
                size="sm"
              />

              <SetMetadata set={set} use24Hour={use24Hour} />
            </div>
          </div>

          <SetDescription
            artists={set.artists}
            setDescription={set.description}
            className="text-purple-200 text-sm line-clamp-2 mb-2"
          />
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <SetVotingButtons
            userVote={userVote}
            votingLoading={votingLoading}
            onVote={handleVote}
            getVoteCount={getVoteCount}
            size="sm"
            layout="horizontal"
          />
        </div>
      </div>
    </div>
  );
}
