
import { useState } from "react";
import { ArtistCard } from "@/components/ArtistCard";
import { ArtistListItem } from "@/components/ArtistListItem";
import { AuthDialog } from "@/components/AuthDialog";
import { FestivalHeader } from "@/components/FestivalHeader";
import { ViewToggle } from "@/components/ViewToggle";
import { FilterSortControls } from "@/components/FilterSortControls";
import { EmptyArtistsState } from "@/components/EmptyArtistsState";
import { GroupSelector } from "@/components/GroupSelector";
import { GroupManagementDialog } from "@/components/GroupManagementDialog";
import { useArtists } from "@/hooks/useArtists";
import { useUrlState } from "@/hooks/useUrlState";

const Index = () => {
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const [showGroupDialog, setShowGroupDialog] = useState(false);
  const { state: filterSortState, updateUrlState } = useUrlState();
  const { user, artists, userVotes, userKnowledge, loading, votingLoading, handleVote, handleKnowledgeToggle, fetchArtists } = useArtists(filterSortState);

  const handleAuthRequired = () => {
    setShowAuthDialog(true);
  };

  const handleEditSuccess = () => {
    fetchArtists();
  };

  const handleAuthSuccess = () => {
    setShowAuthDialog(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
        <FestivalHeader artistCount={0} />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-white">Loading artists...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <FestivalHeader artistCount={artists.length} />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <FilterSortControls 
            state={filterSortState}
            onStateChange={updateUrlState}
            onClear={() => updateUrlState({ 
              stages: [], 
              genres: [], 
              minRating: 0 
            })}
          />
        </div>

        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-4">
            <h2 className="text-2xl font-bold text-white">
              Artists ({artists.length})
            </h2>
            {user && (
              <GroupSelector
                selectedGroupId={filterSortState.groupId}
                onGroupChange={(groupId) => updateUrlState({ groupId })}
                onManageGroups={() => setShowGroupDialog(true)}
              />
            )}
          </div>
          <ViewToggle 
            view={filterSortState.view} 
            onViewChange={(view) => updateUrlState({ view })} 
          />
        </div>

        {artists.length === 0 ? (
          <EmptyArtistsState />
        ) : filterSortState.view === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {artists.map((artist) => (
              <ArtistCard
                key={artist.id}
                artist={artist}
                userVote={userVotes[artist.id]}
                userKnowledge={userKnowledge[artist.id]}
                votingLoading={votingLoading[artist.id]}
                onVote={handleVote}
                onKnowledgeToggle={handleKnowledgeToggle}
                onAuthRequired={handleAuthRequired}
                onEditSuccess={handleEditSuccess}
                user={user}
              />
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {artists.map((artist) => (
              <ArtistListItem
                key={artist.id}
                artist={artist}
                userVote={userVotes[artist.id]}
                userKnowledge={userKnowledge[artist.id]}
                votingLoading={votingLoading[artist.id]}
                onVote={handleVote}
                onKnowledgeToggle={handleKnowledgeToggle}
                onAuthRequired={handleAuthRequired}
                onEditSuccess={handleEditSuccess}
                user={user}
              />
            ))}
          </div>
        )}
      </div>

      <AuthDialog 
        open={showAuthDialog}
        onOpenChange={setShowAuthDialog}
        onSuccess={handleAuthSuccess}
      />

      {user && (
        <GroupManagementDialog
          open={showGroupDialog}
          onOpenChange={setShowGroupDialog}
        />
      )}
    </div>
  );
};

export default Index;
