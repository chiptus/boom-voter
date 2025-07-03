import { User } from "@supabase/supabase-js";

import { useOfflineArtistData } from "@/hooks/useOfflineArtistData";
import { useOfflineVoting } from "@/hooks/useOfflineVoting";
import { Artist } from "@/services/queries";

import { ArtistCard } from "./ArtistCard";
import { ArtistListItem } from "./ArtistListItem";
import { EmptyArtistsState } from "./EmptyArtistsState";

export function ArtistsPanel({
  items,
  isGrid,
  user,
  openAuthDialog,
}: {
  items: Array<Artist>;
  isGrid: boolean;
  user: User;
  openAuthDialog(): void;
}) {
  const { userVotes, votingLoading, handleVote } = useOfflineVoting(
    user,
    () => {} //TODO? should we refretch on vote?
  );
  const { fetchArtists, archiveArtist } = useOfflineArtistData();

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
            onVote={handleVote}
            onKnowledgeToggle={async (artistId: string) => ({
              requiresAuth: !user,
            })}
            onAuthRequired={openAuthDialog}
            onEditSuccess={fetchArtists}
            onArchiveArtist={archiveArtist}
            user={user}
          />
        ))}
      </div>
    );
  }

  return (
    <div className={"space-y-4"}>
      {items.map((artist) => (
        <ArtistListItem
          key={artist.id}
          artist={artist}
          userVote={userVotes[artist.id]}
          userKnowledge={false}
          votingLoading={votingLoading[artist.id]}
          onVote={handleVote}
          onKnowledgeToggle={async (artistId: string) => ({
            requiresAuth: !user,
          })}
          onAuthRequired={openAuthDialog}
          onEditSuccess={fetchArtists}
          onArchiveArtist={archiveArtist}
          user={user}
        />
      ))}
    </div>
  );
}
