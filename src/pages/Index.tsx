
import { useState } from "react";
import { useArtists } from "@/hooks/useArtists";
import { FestivalHeader } from "@/components/FestivalHeader";
import { AuthActionButtons } from "@/components/AuthActionButtons";
import { ArtistCard } from "@/components/ArtistCard";
import { EmptyArtistsState } from "@/components/EmptyArtistsState";
import { AuthDialog } from "@/components/AuthDialog";
import { AddArtistDialog } from "@/components/AddArtistDialog";
import { AddGenreDialog } from "@/components/AddGenreDialog";

const Index = () => {
  const {
    user,
    artists,
    userVotes,
    loading,
    handleVote,
    signOut,
    fetchArtists,
  } = useArtists();

  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const [showAddArtist, setShowAddArtist] = useState(false);
  const [showAddGenre, setShowAddGenre] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <div className="container mx-auto px-4 py-8">
        <FestivalHeader artistCount={artists.length} />

        <AuthActionButtons
          user={user}
          onAddArtist={() => setShowAddArtist(true)}
          onAddGenre={() => setShowAddGenre(true)}
          onSignIn={() => setShowAuthDialog(true)}
          onSignOut={signOut}
        />

        {/* Artists Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {artists.map((artist) => (
            <ArtistCard
              key={artist.id}
              artist={artist}
              userVote={userVotes[artist.id]}
              onVote={handleVote}
              onAuthRequired={() => setShowAuthDialog(true)}
            />
          ))}
        </div>

        {artists.length === 0 && <EmptyArtistsState />}
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
