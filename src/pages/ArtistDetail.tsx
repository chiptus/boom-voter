
import { useParams, useNavigate } from "react-router-dom";
import { AppHeader } from "@/components/AppHeader";
import { ArtistImageCard } from "@/components/ArtistDetail/ArtistImageCard";
import { ArtistInfoCard } from "@/components/ArtistDetail/ArtistInfoCard";
import { ArtistNotFoundState } from "@/components/ArtistDetail/ArtistNotFoundState";
import { ArtistLoadingState } from "@/components/ArtistDetail/ArtistLoadingState";
import { ArtistGroupVoting } from "@/components/ArtistDetail/ArtistGroupVoting";
import { ArtistNotes } from "@/components/ArtistDetail/ArtistNotes";
import { useArtistDetail } from "@/components/ArtistDetail/useArtistDetail";
import { useUrlState } from "@/hooks/useUrlState";

const ArtistDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { state: urlState } = useUrlState();
  const {
    artist,
    user,
    userVote,
    loading,
    canEdit,
    handleVote,
    getVoteCount,
    netVoteScore,
    archiveArtist,
  } = useArtistDetail(id);



  if (loading) {
    return <ArtistLoadingState />;
  }

  if (!artist) {
    return <ArtistNotFoundState />;
  }

  return (
    <div className="min-h-screen bg-app-gradient">
      <div className="container mx-auto px-4 py-8">
        <AppHeader 
          showBackButton
          backTo="/"
          backLabel="Back to Artists"
        />

        {/* Artist Header */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <ArtistImageCard 
            imageUrl={artist.image_url}
            artistName={artist.name}
          />
          
          <ArtistInfoCard
            artist={artist}
            canEdit={canEdit}
            userVote={userVote}
            netVoteScore={netVoteScore}
            onVote={handleVote}
            getVoteCount={getVoteCount}
            onArchiveArtist={canEdit ? handleArchiveArtist : undefined}
            use24Hour={urlState.use24Hour}
          />
        </div>

        {/* Artist Group Voting Section */}
        <div className="mb-8">
          <ArtistGroupVoting artistId={id!} />
        </div>

        {/* Artist Notes Section */}
        <div className="mb-8">
          <ArtistNotes artistId={id!} userId={user?.id || null} />
        </div>
      </div>
    </div>
  );

  async function handleArchiveArtist() {
    await archiveArtist();
    navigate('/');
  }
};

export default ArtistDetail;
