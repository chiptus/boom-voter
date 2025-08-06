import { User } from "@supabase/supabase-js";

import { useOfflineVoting } from "@/hooks/useOfflineVoting";
import { FestivalSet } from "@/services/queries";

import { SetCard } from "./SetCard";
import { SetListItem } from "./SetListItem";
import { EmptyArtistsState } from "./EmptyArtistsState";

export function SetsPanel({
  sets,
  isGrid,
  user,
  use24Hour,
  openAuthDialog,
  onLockSort,
}: {
  sets: Array<FestivalSet>;
  isGrid: boolean;
  user: User | null;
  use24Hour: boolean;
  openAuthDialog(): void;
  onLockSort: () => void;
}) {
  const handleVoteWithLock = async (setId: string, voteType: number) => {
    const result = await handleVote(setId, voteType);
    if (!result.requiresAuth) {
      onLockSort();
    }
    return result;
  };

  const { userVotes, votingLoading, handleVote } = useOfflineVoting(
    user,
    undefined // Remove the refresh callback to prevent auto re-sorting
  );

  if (sets.length === 0) {
    return <EmptyArtistsState />;
  }

  if (isGrid) {
    return (
      <div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        data-testid="artists-grid"
      >
        {sets.map((set) => (
          <SetCard
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
          />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4" data-testid="artists-list">
      {sets.map((set) => (
        <SetListItem
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
        />
      ))}
    </div>
  );
}
