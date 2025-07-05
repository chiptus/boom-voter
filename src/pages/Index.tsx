
// Festival Index Page
import { useState } from "react";
import { Link } from "react-router-dom";
import { Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useProfileQuery } from "@/hooks/queries/useProfileQuery";
import { useInviteValidation } from "@/hooks/useInviteValidation";
import { AuthDialog } from "@/components/AuthDialog";
import { UsernameSetupDialog } from "@/components/UsernameSetupDialog";

import { AddArtistDialog } from "@/components/AddArtistDialog";
import { AddGenreDialog } from "@/components/AddGenreDialog";
import { FilterSortControls } from "@/components/filters/FilterSortControls";
import { ArtistCard } from "@/components/ArtistCard";
import { ArtistListItem } from "@/components/ArtistListItem";
import { EmptyArtistsState } from "@/components/EmptyArtistsState";
import { AppHeader } from "@/components/AppHeader";
import { InviteLandingPage } from "@/components/InviteLandingPage";
import { useArtistFiltering } from "@/hooks/useArtistFiltering";
import { useOfflineArtistData } from "@/hooks/useOfflineArtistData";
import { useOfflineVoting } from "@/hooks/useOfflineVoting";
import { useEffect } from "react";
import { useUrlState } from "@/hooks/useUrlState";

const Index = () => {
  const { user, loading, signOut, hasUsername } = useAuth();
  const { inviteValidation, isValidating, hasValidInvite, useInvite, clearInvite } = useInviteValidation();
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const [showUsernameSetup, setShowUsernameSetup] = useState(false);
  const [showAddArtistDialog, setShowAddArtistDialog] = useState(false);
  const [showAddGenreDialog, setShowAddGenreDialog] = useState(false);
  const { state: urlState, updateUrlState, clearFilters } = useUrlState();
  
  const { artists, fetchArtists, archiveArtist } = useOfflineArtistData();
  const { userVotes, votingLoading, handleVote } = useOfflineVoting(user);
  
  const { filteredAndSortedArtists } = useArtistFiltering(artists, urlState);
  
  // Get profile loading state to prevent dialog flashing
  const { data: profile, isLoading: profileLoading } = useProfileQuery(user?.id);

  // Check if username setup is needed after authentication
  useEffect(() => {
    // Only show dialog when all data is loaded and user definitely needs username setup
    if (user && !loading && !profileLoading && !hasUsername()) {
      setShowUsernameSetup(true);
    }
    // Hide dialog when user gets a username or logs out or data is still loading
    if (!user || (user && !loading && !profileLoading && hasUsername())) {
      setShowUsernameSetup(false);
    }
  }, [user, loading, profileLoading, hasUsername]);

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
        onSignupSuccess={() => {
          setShowAuthDialog(false);
          // Invite processing is now handled in useAuth hook
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
        <AppHeader 
          title="Boom Festival"
          subtitle="Vote for your favorite artists!"
          description={`${filteredAndSortedArtists.length} artists available for voting`}
          user={user}
          onSignIn={() => setShowAuthDialog(true)}
          onSignOut={signOut}
          onAddArtist={() => setShowAddArtistDialog(true)}
          onAddGenre={() => setShowAddGenreDialog(true)}
          showScheduleButton={true}
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
                    onArchiveArtist={archiveArtist}
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
                    onArchiveArtist={archiveArtist}
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

        <UsernameSetupDialog
          open={showUsernameSetup}
          user={user}
          onSuccess={() => {
            setShowUsernameSetup(false);
          }}
        />
      </div>
    </div>
  );
};

export default Index;
