
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArtistDetailHeader } from "@/components/artist-detail/ArtistDetailHeader";
import { ArtistImageCard } from "@/components/artist-detail/ArtistImageCard";
import { ArtistInfoCard } from "@/components/artist-detail/ArtistInfoCard";
import { ArtistNotFoundState } from "@/components/artist-detail/ArtistNotFoundState";
import { ArtistLoadingState } from "@/components/artist-detail/ArtistLoadingState";
import { ArtistNotes } from "@/components/ArtistNotes";
import { ArtistGroupVotes } from "@/components/artist-detail/ArtistGroupVotes";
import { useArtistDetail } from "@/hooks/useArtistDetail";

const ArtistDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [selectedNotesGroupId, setSelectedNotesGroupId] = useState<string | undefined>();
  const [selectedVotesGroupId, setSelectedVotesGroupId] = useState<string | undefined>();
  
  const {
    artist,
    user,
    userVote,
    loading,
    canEdit,
    handleVote,
    getVoteCount,
    netVoteScore,
    fetchArtist,
    archiveArtist,
  } = useArtistDetail(id);

  const handleArchiveArtist = async () => {
    await archiveArtist();
    navigate('/');
  };

  if (loading) {
    return <ArtistLoadingState />;
  }

  if (!artist) {
    return <ArtistNotFoundState />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <div className="container mx-auto px-4 py-8">
        <ArtistDetailHeader />

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
            onArtistUpdate={fetchArtist}
            onArchiveArtist={canEdit ? handleArchiveArtist : undefined}
          />
        </div>

        {/* Artist Notes Section */}
        <div className="mb-8">
          <ArtistNotes 
            artistId={id!} 
            userId={user?.id || null}
            selectedGroupId={selectedNotesGroupId}
            onGroupChange={setSelectedNotesGroupId}
          />
        </div>

        {/* Group Votes Section */}
        <div className="mb-8">
          <ArtistGroupVotes 
            artistId={id!}
            selectedGroupId={selectedVotesGroupId}
            onGroupChange={setSelectedVotesGroupId}
          />
        </div>
      </div>
    </div>
  );
};

export default ArtistDetail;
