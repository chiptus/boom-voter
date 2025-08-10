import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { FestivalSet } from "@/services/queries";
import { SetHeader } from "./shared/SetHeader";
import { SetImage } from "./shared/SetImage";
import { SetMetadata } from "./shared/SetMetadata";
import { SetDescription } from "./shared/SetDescription";
import { SetVotingButtons } from "./shared/SetVotingButtons";

interface SingleArtistSetCardProps {
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

export function SingleArtistSetCard({
  set,
  userVote,
  userKnowledge,
  votingLoading,
  onVote,
  onKnowledgeToggle,
  onAuthRequired,
  use24Hour = false,
}: SingleArtistSetCardProps) {
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

  return (
    <Card className="bg-white/10 backdrop-blur-md border-purple-400/30 hover:bg-white/15 transition-all duration-300 overflow-hidden">
      <CardHeader className="pb-4">
        {/* Set Image */}
        <SetImage artists={set.artists} setName={set.name} setSlug={set.slug} />

        <div className="flex items-start justify-between">
          <div className="flex-1">
            <SetHeader
              setName={set.name}
              artists={set.artists}
              userKnowledge={userKnowledge}
              onKnowledgeToggle={handleKnowledgeToggle}
            />

            <SetMetadata set={set} use24Hour={use24Hour} />
          </div>
        </div>

        <SetDescription
          artists={set.artists}
          setDescription={set.description}
        />
      </CardHeader>

      <CardContent>
        <SetVotingButtons
          userVote={userVote}
          votingLoading={votingLoading}
          onVote={handleVote}
          getVoteCount={getVoteCount}
        />
      </CardContent>
    </Card>
  );
}
