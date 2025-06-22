
// Festival Index Page
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useInviteValidation } from "@/hooks/useInviteValidation";
import { AuthDialog } from "@/components/AuthDialog";
import { AuthActionButtons } from "@/components/AuthActionButtons";
import { AddArtistDialog } from "@/components/AddArtistDialog";
import { AddGenreDialog } from "@/components/AddGenreDialog";
import { FilterSortControls } from "@/components/filters/FilterSortControls";
import { ArtistCard } from "@/components/ArtistCard";
import { ArtistListItem } from "@/components/ArtistListItem";
import { EmptyArtistsState } from "@/components/EmptyArtistsState";
import { FestivalHeader } from "@/components/FestivalHeader";
import { InviteLandingPage } from "@/components/InviteLandingPage";
import { useArtistFiltering } from "@/hooks/useArtistFiltering";
import { useArtistData } from "@/hooks/useArtistData";
import { useVoting } from "@/hooks/useVoting";

import { useUrlState } from "@/hooks/useUrlState";

const Index = () => {
  const { user, loading, signOut } = useAuth();
  const { inviteValidation, isValidating, hasValidInvite, useInvite, clearInvite } = useInviteValidation();
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const [showAddArtistDialog, setShowAddArtistDialog] = useState(false);
  const [showAddGenreDialog, setShowAddGenreDialog] = useState(false);
  const { state: urlState, updateUrlState, clearFilters } = useUrlState();
  
  const { artists, fetchArtists } = useArtistData();
  const { userVotes, votingLoading, handleVote } = useVoting(user, fetchArtists);
  
  const { filteredAndSortedArtists } = useArtistFiltering(artists, urlState);

  // Show loading while validating invite
  if (isValidating) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-white text-xl">Validating invite...</div>
      </div>
    );
  }

  // Show invite landing page if there's a valid invite and user is not logged in
  if (hasValidInvite && !user && inviteValidation) {
    return (
      <InviteLandingPage
        inviteValidation={inviteValidation}
        onSignupSuccess={async () => {
          setShowAuthDialog(false);
          // Wait a moment for auth state to update, then try to use invite
          setTimeout(async () => {
            const { data: { user: newUser } } = await supabase.auth.getUser();
            if (newUser && inviteValidation) {
              await useInvite(newUser.id);
              clearInvite();
            }
          }, 1000);
        }}
      />
    );
  }

  // Show error page for invalid invites
  if (urlState.invite && inviteValidation && !inviteValidation.is_valid) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
        <div className="text-center text-white">
          <h1 className="text-2xl font-bold mb-4">Invalid Invite</h1>
          <p className="mb-4">This invite link is no longer valid.</p>
          <button 
            onClick={() => window.location.href = "/"}
            className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded"
          >
            Go to Festival
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <div className="container mx-auto px-4 py-8">
        <FestivalHeader artistCount={filteredAndSortedArtists.length} />
        
        <AuthActionButtons
          user={user}
          onAddArtist={() => setShowAddArtistDialog(true)}
          onAddGenre={() => setShowAddGenreDialog(true)}
          onSignIn={() => setShowAuthDialog(true)}
          onSignOut={signOut}
        />

        <FilterSortControls
          state={urlState}
          onStateChange={updateUrlState}
          onClear={clearFilters}
        />

        <div className="mt-8">
          {filteredAndSortedArtists.length === 0 ? (
            <EmptyArtistsState />
          ) : (
            <div className={
              urlState.view === 'grid' 
                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                : "space-y-4"
            }>
              {filteredAndSortedArtists.map((artist) => 
                urlState.view === 'grid' ? (
                  <ArtistCard 
                    key={artist.id} 
                    artist={artist}
                    userVote={userVotes[artist.id]}
                    userKnowledge={false}
                    votingLoading={votingLoading[artist.id]}
                    onVote={handleVote}
                    onKnowledgeToggle={async (artistId: string) => ({ requiresAuth: !user })}
                    onAuthRequired={() => setShowAuthDialog(true)}
                    onEditSuccess={fetchArtists}
                    user={user}
                  />
                ) : (
                  <ArtistListItem 
                    key={artist.id} 
                    artist={artist}
                    userVote={userVotes[artist.id]}
                    userKnowledge={false}
                    votingLoading={votingLoading[artist.id]}
                    onVote={handleVote}
                    onKnowledgeToggle={async (artistId: string) => ({ requiresAuth: !user })}
                    onAuthRequired={() => setShowAuthDialog(true)}
                    onEditSuccess={fetchArtists}
                    user={user}
                  />
                )
              )}
            </div>
          )}
        </div>

        <AuthDialog
          open={showAuthDialog}
          onOpenChange={setShowAuthDialog}
          onSuccess={() => setShowAuthDialog(false)}
          inviteToken={hasValidInvite ? inviteValidation?.invite_id : undefined}
          groupName={hasValidInvite ? inviteValidation?.group_name : undefined}
        />

        <AddArtistDialog
          open={showAddArtistDialog}
          onOpenChange={setShowAddArtistDialog}
          onSuccess={() => {
            setShowAddArtistDialog(false);
            fetchArtists();
          }}
        />

        <AddGenreDialog
          open={showAddGenreDialog}
          onOpenChange={setShowAddGenreDialog}
        />
      </div>
    </div>
  );
};

export default Index;
