import { useParams } from "react-router-dom";
import { AppHeader } from "@/components/AppHeader";
import { ArtistImageCard } from "@/components/SetDetail/SetImageCard";
import { MixedArtistImage } from "@/components/SetDetail/MixedArtistImage";
import { SetInfoCard } from "@/components/SetDetail/SetInfoCard";
import { MultiArtistSetInfoCard } from "@/components/SetDetail/MultiArtistSetInfoCard";
import { ArtistNotFoundState } from "@/components/SetDetail/SetNotFoundState";
import { ArtistLoadingState } from "@/components/SetDetail/SetLoadingState";
import { SetGroupVoting } from "@/components/SetDetail/SetGroupVoting";
import { ArtistNotes } from "@/components/SetDetail/SetNotes";
import { useUrlState } from "@/hooks/useUrlState";
import { useSetDetail } from "@/components/SetDetail/useSetDetail";

export function SetDetails() {
  const { setSlug } = useParams<{ setSlug: string }>();

  const { state: urlState } = useUrlState();
  const {
    currentSet,
    user,
    userVote,
    loading,
    handleVote,
    getVoteCount,
    netVoteScore,
  } = useSetDetail(setSlug);

  if (loading) {
    return <ArtistLoadingState />;
  }

  if (!currentSet) {
    return <ArtistNotFoundState />;
  }

  const isMultiArtistSet = currentSet.artists.length > 1;
  const primaryArtist = currentSet.artists[0];

  return (
    <div className="min-h-screen bg-app-gradient">
      <div className="container mx-auto px-4 py-8">
        <AppHeader showBackButton backLabel="Back to Artists" />

        {/* Set Header */}
        {isMultiArtistSet ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            {/* Mixed Image for Multi-Artist Sets */}
            <MixedArtistImage
              artists={currentSet.artists}
              setName={currentSet.name}
              className="aspect-square rounded-lg"
            />

            <MultiArtistSetInfoCard
              set={currentSet}
              userVote={userVote}
              netVoteScore={netVoteScore}
              onVote={handleVote}
              getVoteCount={getVoteCount}
              use24Hour={urlState.use24Hour}
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            {/* Single Artist Image */}
            <ArtistImageCard
              imageUrl={primaryArtist.image_url}
              artistName={currentSet.name}
            />

            <SetInfoCard
              set={currentSet}
              userVote={userVote}
              netVoteScore={netVoteScore}
              onVote={handleVote}
              getVoteCount={getVoteCount}
              use24Hour={urlState.use24Hour}
            />
          </div>
        )}

        {/* Set Group Voting Section */}
        <div className="mb-8">
          <SetGroupVoting setId={currentSet.id} />
        </div>

        {/* Set Notes Section */}
        <div className="mb-8">
          <ArtistNotes artistId={currentSet.id} userId={user?.id || null} />
        </div>
      </div>
    </div>
  );
}
