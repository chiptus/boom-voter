import { User } from "@supabase/supabase-js";

import { useOfflineVoting } from "@/hooks/useOfflineVoting";
import { Set } from "@/services/queries";
import { setsToArtists } from "@/utils/setToArtistAdapter";

import { ArtistCard } from "./ArtistCard";
import { ArtistListItem } from "./ArtistListItem";
import { EmptyArtistsState } from "./EmptyArtistsState";

export function ArtistsPanel({
  items,
  isGrid,
  user,
  use24Hour,
  openAuthDialog,

  onLockSort,
}: {
  items: Array<Set>;
  isGrid: boolean;
  user: User;
  use24Hour: boolean;
  openAuthDialog(): void;
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

  // Convert sets to artists for backward compatibility with existing card components
  const artists = setsToArtists(items);

  if (items.length === 0) {
    return <EmptyArtistsState />;
  }

  if (isGrid) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" data-testid="artists-grid">
        {artists.map((artist) => (
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
    <div className="space-y-4" data-testid="artists-list">
      {artists.map((artist) => (
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
