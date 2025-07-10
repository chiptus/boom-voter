import { User } from "@supabase/supabase-js";

import { useOfflineArtistData } from "@/hooks/useOfflineArtistData";
import { useOfflineVoting } from "@/hooks/useOfflineVoting";
import { Artist } from "@/services/queries";
import { FilterSortState } from "@/hooks/useUrlState";

import { ArtistCard } from "./ArtistCard";
import { ArtistListItem } from "./ArtistListItem";
import { EmptyArtistsState } from "./EmptyArtistsState";

export function ArtistsPanel({
  items,
  isGrid,
  user,
  use24Hour,
  openAuthDialog,
  fetchArtists,
  archiveArtist,
  onLockSort,
}: {
  items: Array<Artist>;
  isGrid: boolean;
  user: User;
  use24Hour: boolean;
  openAuthDialog(): void;
  fetchArtists(): void;
  archiveArtist(artistId: string): Promise<void>;
  onLockSort: () => void;
}) {
  const handleVoteWithLock = async (artistId: string, voteType: number) => {
    const result = await handleVote(artistId, voteType);
    if (!result.requiresAuth) {
      onLockSort();
    }
    return result;
  };

  const { userVotes, votingLoading, handleVote } = useOfflineVoting(
    user,
    undefined // Remove the refresh callback to prevent auto re-sorting
  );

  if (items.length === 0) {
    return <EmptyArtistsState />;
  }

  if (isGrid) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {items.map((artist) => (
            <ArtistCard
            key={artist.id}
            artist={artist}
            userVote={userVotes[artist.id]}
            userKnowledge={false}
            votingLoading={votingLoading[artist.id]}
            onVote={handleVoteWithLock}
            onKnowledgeToggle={async (artistId: string) => ({
              requiresAuth: !user,
            })}
            onAuthRequired={openAuthDialog}
            user={user}
            use24Hour={use24Hour}
          />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {items.map((artist) => (
        <ArtistListItem
          key={artist.id}
          artist={artist}
          userVote={userVotes[artist.id]}
          userKnowledge={false}
          votingLoading={votingLoading[artist.id]}
          onVote={handleVoteWithLock}
          onKnowledgeToggle={async (artistId: string) => ({
            requiresAuth: !user,
          })}
          onAuthRequired={openAuthDialog}
          user={user}
          use24Hour={use24Hour}
        />
      ))}
    </div>
  );
}
