import { User } from "@supabase/supabase-js";

import { useOfflineVoting } from "@/hooks/useOfflineVoting";
import { FestivalSet } from "@/services/queries";

import { EmptyArtistsState } from "./EmptyArtistsState";
import { FestivalSetProvider } from "./FestivalSetContext";
import { SingleArtistSetListItem } from "./SingleArtistSetListItem";
import { MultiArtistSetListItem } from "./MultiArtistSetListItem";

export function SetsPanel({
  sets,
  user,
  use24Hour,
  openAuthDialog,
  onLockSort,
}: {
  sets: Array<FestivalSet>;
  user: User | null;
  use24Hour: boolean;
  openAuthDialog(): void;
  onLockSort: () => void;
}) {
  async function handleVoteWithLock(setId: string, voteType: number) {
    const result = await handleVote(setId, voteType);
    if (!result.requiresAuth) {
      onLockSort();
    }
    return result;
  }

  const { userVotes, votingLoading, handleVote } = useOfflineVoting(
    user,
    undefined, // Remove the refresh callback to prevent auto re-sorting
  );

  if (sets.length === 0) {
    return <EmptyArtistsState />;
  }

  return (
    <div className="space-y-4" data-testid="artists-list">
      {sets.map((set) => (
        <FestivalSetProvider
          key={set.id}
          set={set}
          userVote={userVotes[set.id]}
          userKnowledge={false}
          votingLoading={votingLoading[set.id]}
          onVote={handleVoteWithLock}
          onKnowledgeToggle={async (_: string) => ({
            requiresAuth: !user,
          })}
          onAuthRequired={openAuthDialog}
          use24Hour={use24Hour}
        >
          {set.artists.length > 1 ? (
            <MultiArtistSetListItem />
          ) : (
            <SingleArtistSetListItem />
          )}
        </FestivalSetProvider>
      ))}
    </div>
  );
}
