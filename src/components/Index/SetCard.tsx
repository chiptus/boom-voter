import { FestivalSet } from "@/services/queries";
import { SingleArtistSetCard } from "./SingleArtistSetCard";
import { MultiArtistSetCard } from "./MultiArtistSetCard";

interface SetCardProps {
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

export function SetCard({
  set,
  userVote,
  userKnowledge,
  votingLoading,
  onVote,
  onKnowledgeToggle,
  onAuthRequired,
  use24Hour = false,
}: SetCardProps) {
  const isMultiArtist = set.artists.length > 1;

  const commonProps = {
    set,
    userVote,
    userKnowledge,
    votingLoading,
    onVote,
    onKnowledgeToggle,
    onAuthRequired,
    use24Hour,
  };

  return isMultiArtist ? (
    <MultiArtistSetCard {...commonProps} />
  ) : (
    <SingleArtistSetCard {...commonProps} />
  );
}
