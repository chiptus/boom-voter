import { useParams } from "react-router-dom";
import { AppHeader } from "@/components/AppHeader";
import { ArtistImageCard } from "@/components/SetDetail/SetImageCard";
import { ArtistInfoCard } from "@/components/SetDetail/SetInfoCard";
import { ArtistNotFoundState } from "@/components/SetDetail/SetNotFoundState";
import { ArtistLoadingState } from "@/components/SetDetail/SetLoadingState";
import { SetGroupVoting } from "@/components/SetDetail/SetGroupVoting";
import { ArtistNotes } from "@/components/SetDetail/SetNotes";
import { useUrlState } from "@/hooks/useUrlState";
import { useSetDetail } from "@/components/SetDetail/useSetDetail";

export function SetDetails() {
  const { setId } = useParams<{ setId: string }>();

  const { state: urlState } = useUrlState();
  const {
    currentSet,
    user,
    userVote,
    loading,
    handleVote,
    getVoteCount,
    netVoteScore,
  } = useSetDetail(setId);

  if (loading) {
    return <ArtistLoadingState />;
  }

  if (!currentSet) {
    return <ArtistNotFoundState />;
  }

  const artist = currentSet.artists[0];

  return (
    <div className="min-h-screen bg-app-gradient">
      <div className="container mx-auto px-4 py-8">
        <AppHeader showBackButton backTo="/" backLabel="Back to Artists" />

        {/* Artist Header */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <ArtistImageCard
            imageUrl={artist.image_url}
            artistName={currentSet.name}
          />

          <ArtistInfoCard
            artist={artist}
            userVote={userVote}
            netVoteScore={netVoteScore}
            onVote={handleVote}
            getVoteCount={getVoteCount}
            use24Hour={urlState.use24Hour}
          />
        </div>

        {/* Artist Group Voting Section */}
        <div className="mb-8">
          <SetGroupVoting setId={currentSet.id} />
        </div>

        {/* Artist Notes Section */}
        <div className="mb-8">
          <ArtistNotes artistId={currentSet.id} userId={user?.id || null} />
        </div>
      </div>
    </div>
  );
}
