
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArtistCard } from "@/components/ArtistCard";
import { ArtistListItem } from "@/components/ArtistListItem";
import { AuthDialog } from "@/components/AuthDialog";
import { FestivalHeader } from "@/components/FestivalHeader";
import { ViewToggle } from "@/components/ViewToggle";
import { FilterSortControls } from "@/components/FilterSortControls";
import { EmptyArtistsState } from "@/components/EmptyArtistsState";
import { useArtists } from "@/hooks/useArtists";
import { useUrlState } from "@/hooks/useUrlState";
import { useGroups } from "@/hooks/useGroups";
import { Button } from "@/components/ui/button";
import { Users } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const { state: filterSortState, updateUrlState } = useUrlState();
  const { user, artists, userVotes, userKnowledge, loading, votingLoading, handleVote, handleKnowledgeToggle, fetchArtists } = useArtists(filterSortState);
  const { groups } = useGroups();

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
        {user && groups.length > 1 && (
          <div className="mb-6 flex justify-between items-center">
            <div className="flex items-center gap-4">
              <span className="text-white font-medium">Filter by group:</span>
              <select
                value={filterSortState.groupId || "all"}
                onChange={(e) => updateUrlState({ groupId: e.target.value === "all" ? undefined : e.target.value })}
                className="bg-white/10 border border-purple-400/30 text-white rounded-md px-3 py-1.5"
              >
                <option value="all">All votes</option>
                {groups.map((group) => (
                  <option key={group.id} value={group.id}>
                    {group.name} ({group.member_count} members)
                  </option>
                ))}
              </select>
            </div>
            <Button
              onClick={() => navigate("/groups")}
              variant="outline"
              className="bg-white/10 border-purple-400/30 text-white hover:bg-white/20"
            >
              <Users className="h-4 w-4 mr-2" />
              Manage Groups
            </Button>
          </div>
        )}
        
        {user && groups.length === 0 && (
          <div className="mb-6 flex justify-end">
            <Button
              onClick={() => navigate("/groups")}
              className="bg-purple-600 hover:bg-purple-700"
            >
              <Users className="h-4 w-4 mr-2" />
              Create Group
            </Button>
          </div>
        )}
        
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
    </div>
  );
};

export default Index;
