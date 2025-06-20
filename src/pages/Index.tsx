
import { useState, useEffect } from "react";
import { useArtists } from "@/hooks/useArtists";
import { useUrlState } from "@/hooks/useUrlState";
import { FestivalHeader } from "@/components/FestivalHeader";
import { AuthActionButtons } from "@/components/AuthActionButtons";
import { ArtistCard } from "@/components/ArtistCard";
import { ArtistListItem } from "@/components/ArtistListItem";
import { EmptyArtistsState } from "@/components/EmptyArtistsState";
import { AuthDialog } from "@/components/AuthDialog";
import { AddArtistDialog } from "@/components/AddArtistDialog";
import { AddGenreDialog } from "@/components/AddGenreDialog";
import { ViewToggle } from "@/components/ViewToggle";
import { FilterSortControls } from "@/components/FilterSortControls";
import { Skeleton } from "@/components/ui/skeleton";

const Index = () => {
  const { state: urlState, updateUrlState, clearFilters } = useUrlState();
  const {
    user,
    artists,
    allArtists,
    userVotes,
    userKnowledge,
    loading,
    handleVote,
    handleKnowledgeToggle,
    signOut,
    fetchArtists,
  } = useArtists(urlState);

  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const [showAddArtist, setShowAddArtist] = useState(false);
  const [showAddGenre, setShowAddGenre] = useState(false);

  // Sync view state with URL
  useEffect(() => {
    updateUrlState({ view: urlState.view });
  }, []);

  const handleViewChange = (newView: 'grid' | 'list') => {
    updateUrlState({ view: newView });
  };

  const LoadingSkeleton = () => (
    <div className="space-y-4">
      {[...Array(8)].map((_, i) => (
        <div key={i} className="bg-white/10 backdrop-blur-md border-purple-400/30 rounded-lg p-4 flex items-center gap-4">
          <Skeleton className="w-16 h-16 rounded-lg" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-5 w-48" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-3 w-64" />
          </div>
          <div className="flex gap-2">
            <Skeleton className="h-8 w-16" />
            <Skeleton className="h-8 w-16" />
          </div>
        </div>
      ))}
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
        <div className="container mx-auto px-4 py-8">
          <FestivalHeader artistCount={0} />
          
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-8">
            <AuthActionButtons
              user={user}
              onAddArtist={() => setShowAddArtist(true)}
              onAddGenre={() => setShowAddGenre(true)}
              onSignIn={() => setShowAuthDialog(true)}
              onSignOut={signOut}
            />
            
            <ViewToggle view={urlState.view} onViewChange={handleViewChange} />
          </div>

          <LoadingSkeleton />
        </div>

        <AuthDialog 
          open={showAuthDialog} 
          onOpenChange={setShowAuthDialog}
          onSuccess={() => {
            setShowAuthDialog(false);
            fetchArtists();
          }}
        />
        
        <AddArtistDialog 
          open={showAddArtist} 
          onOpenChange={setShowAddArtist}
          onSuccess={() => {
            setShowAddArtist(false);
            fetchArtists();
          }}
        />
        
        <AddGenreDialog 
          open={showAddGenre} 
          onOpenChange={setShowAddGenre}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <div className="container mx-auto px-4 py-8">
        <FestivalHeader artistCount={artists.length} />

        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-8">
          <AuthActionButtons
            user={user}
            onAddArtist={() => setShowAddArtist(true)}
            onAddGenre={() => setShowAddGenre(true)}
            onSignIn={() => setShowAuthDialog(true)}
            onSignOut={signOut}
          />
          
          {allArtists.length > 0 && (
            <ViewToggle view={urlState.view} onViewChange={handleViewChange} />
          )}
        </div>

        {/* Filter and Sort Controls */}
        {allArtists.length > 0 && (
          <div className="mb-8">
            <FilterSortControls
              state={urlState}
              onStateChange={updateUrlState}
              onClear={clearFilters}
            />
          </div>
        )}

        {/* Artists Display */}
        {urlState.view === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {artists.map((artist) => (
              <ArtistCard
                key={artist.id}
                artist={artist}
                userVote={userVotes[artist.id]}
                userKnowledge={userKnowledge[artist.id]}
                onVote={handleVote}
                onKnowledgeToggle={handleKnowledgeToggle}
                onAuthRequired={() => setShowAuthDialog(true)}
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
                onVote={handleVote}
                onKnowledgeToggle={handleKnowledgeToggle}
                onAuthRequired={() => setShowAuthDialog(true)}
              />
            ))}
          </div>
        )}

        {allArtists.length === 0 && !loading && <EmptyArtistsState />}
        
        {/* Show message when filters result in no artists */}
        {allArtists.length > 0 && artists.length === 0 && !loading && (
          <div className="text-center py-12">
            <p className="text-purple-200 text-lg mb-4">No artists match your current filters</p>
            <button
              onClick={clearFilters}
              className="text-purple-400 hover:text-purple-300 underline"
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>

      <AuthDialog 
        open={showAuthDialog} 
        onOpenChange={setShowAuthDialog}
        onSuccess={() => {
          setShowAuthDialog(false);
          fetchArtists();
        }}
      />
      
      <AddArtistDialog 
        open={showAddArtist} 
        onOpenChange={setShowAddArtist}
        onSuccess={() => {
          setShowAddArtist(false);
          fetchArtists();
        }}
      />
      
      <AddGenreDialog 
        open={showAddGenre} 
        onOpenChange={setShowAddGenre}
      />
    </div>
  );
};

export default Index;
