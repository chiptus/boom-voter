import { useState, useEffect } from "react";

import { useAuth } from "@/hooks/useAuth";
import { useProfileQuery } from "@/hooks/queries/useProfileQuery";
import { useInviteValidation } from "@/components/Index/useInviteValidation";
import { AuthDialog } from "@/components/AuthDialog";
import { UsernameSetupDialog } from "@/components/Index/UsernameSetupDialog";

import { FilterSortControls } from "@/components/Index/filters/FilterSortControls";
import { AppHeader } from "@/components/AppHeader";
import { InviteLandingPage } from "@/components/Index/InviteLandingPage";
import { useArtistFiltering } from "@/components/Index/useArtistFiltering";
import { useOfflineArtistData } from "@/hooks/useOfflineArtistData";
import { useOfflineVoting } from "@/hooks/useOfflineVoting";
import { useUrlState } from "@/hooks/useUrlState";
import { ArtistsPanel } from "@/components/Index/ArtistsPanel";
import { ScheduleHorizontalTimelineView } from "@/components/schedule/ScheduleHorizontalTimelineView";
import ErrorBoundary from "@/components/ErrorBoundary";

export default function Index() {
  const { user, loading: authLoading, signOut, hasUsername } = useAuth();
  const { inviteValidation, isValidating, hasValidInvite } =
    useInviteValidation();
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const [showUsernameSetup, setShowUsernameSetup] = useState(false);
  const { state: urlState, updateUrlState, clearFilters } = useUrlState();
  
  const { artists, fetchArtists, archiveArtist } = useOfflineArtistData();
  const { userVotes, handleVote } = useOfflineVoting(user);
  
  const { filteredAndSortedArtists } = useArtistFiltering(artists, urlState);

  // Get profile loading state to prevent dialog flashing
  const { isLoading: profileLoading } = useProfileQuery(user?.id);

  // Check if username setup is needed after authentication
  useEffect(() => {
    // Only show dialog when all data is loaded and user definitely needs username setup
    if (user && !authLoading && !profileLoading && !hasUsername()) {
      setShowUsernameSetup(true);
    }
    // Hide dialog when user gets a username or logs out or data is still loading
    if (!user || (user && !authLoading && !profileLoading && hasUsername())) {
      setShowUsernameSetup(false);
    }
  }, [user, authLoading, profileLoading, hasUsername]);

  // Show loading while validating invite
  if (isValidating) {
    return (
      <div className="min-h-screen bg-app-gradient flex items-center justify-center">
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
      <div className="min-h-screen bg-app-gradient flex items-center justify-center p-4">
        <div className="text-center text-white">
          <h1 className="text-2xl font-bold mb-4">Invalid Invite</h1>
          <p className="mb-4">This invite link is no longer valid.</p>
          <button
            onClick={() => (window.location.href = "/")}
            className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded"
          >
            Go to Festival
          </button>
        </div>
      </div>
    );
  }

  if (authLoading) {
    return (
      <div className="min-h-screen bg-app-gradient flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  const handleVoteAction = async (artistId: string, voteType: number) => {
    const result = await handleVote(artistId, voteType);
    if (result.requiresAuth) {
      setShowAuthDialog(true);
    }
  };

  return (
    <div className="min-h-screen bg-app-gradient">
      <div className="container mx-auto px-4 py-8">
        <AppHeader 
          title="Boom Festival"
          subtitle="Vote for your favorite artists!"
          description={`${filteredAndSortedArtists.length} artists available for voting`}
          user={user}
          onSignIn={() => setShowAuthDialog(true)}
          onSignOut={signOut}
          showGroupsButton={true}
        />

        <FilterSortControls
          state={urlState}
          onStateChange={updateUrlState}
          onClear={clearFilters}
        />

        <div className="mt-8">
          <ErrorBoundary>
            {urlState.mainView === 'list' && (
              <ArtistsPanel
                items={filteredAndSortedArtists}
                isGrid={false}
                user={user}
                use24Hour={urlState.use24Hour}
                openAuthDialog={() => setShowAuthDialog(true)}
                fetchArtists={fetchArtists}
                archiveArtist={archiveArtist}
                onLockSort={() => updateUrlState({ sortLocked: true })}
              />
            )}
            {urlState.mainView === 'timeline' && (
              <ScheduleHorizontalTimelineView
                userVotes={userVotes}
                onVote={handleVoteAction}
              />
            )}
          </ErrorBoundary>
        </div>

        <AuthDialog
          open={showAuthDialog}
          onOpenChange={setShowAuthDialog}
          onSuccess={() => setShowAuthDialog(false)}
          inviteToken={hasValidInvite ? inviteValidation?.invite_id : undefined}
          groupName={hasValidInvite ? inviteValidation?.group_name : undefined}
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
}
