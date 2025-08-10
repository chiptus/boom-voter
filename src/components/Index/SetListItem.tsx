import { User } from "@supabase/supabase-js";
import { FestivalSet } from "@/services/queries";
import { SingleArtistSetListItem } from "./SingleArtistSetListItem";
import { MultiArtistSetListItem } from "./MultiArtistSetListItem";

interface SetListItemProps {
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
  user?: User;
  use24Hour?: boolean;
}

export function SetListItem({
  set,
  userVote,
  userKnowledge,
  votingLoading,
  onVote,
  onKnowledgeToggle,
  onAuthRequired,
  use24Hour = false,
}: SetListItemProps) {
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
    <MultiArtistSetListItem {...commonProps} />
  ) : (
    <SingleArtistSetListItem {...commonProps} />
  );
}
