import { useState, useMemo, useEffect } from "react";

import { useAuth } from "@/contexts/AuthContext";
import { useProfileQuery } from "@/hooks/queries/useProfileQuery";
import { useInviteValidation } from "@/components/Index/useInviteValidation";
import { AuthDialog } from "@/components/AuthDialog";
import { UsernameSetupDialog } from "@/components/Index/UsernameSetupDialog";

import { FilterSortControls } from "@/components/Index/filters/FilterSortControls";
import { AppHeader } from "@/components/AppHeader";
import { InviteLandingPage } from "@/components/Index/InviteLandingPage";
import { useSetFiltering } from "@/components/Index/useSetFiltering";
import { useOfflineVoting } from "@/hooks/useOfflineVoting";
import { useUrlState } from "@/hooks/useUrlState";
import { SetsPanel } from "@/components/Index/SetsPanel";
import { ScheduleHorizontalTimelineView } from "@/components/schedule/ScheduleHorizontalTimelineView";
import ErrorBoundary from "@/components/ErrorBoundary";
import { useEditionSetsQuery } from "@/hooks/queries/useEditionSetsQuery";
import { useFestivalEdition } from "@/contexts/FestivalEditionContext";
import { GroupsCTA } from "@/components/Groups/GroupsCTA";
import { GroupsOnboardingModal } from "@/components/Groups/GroupsOnboardingModal";
import { useGroups } from "@/hooks/useGroups";

export default function EditionView() {
  const { user, loading: authLoading, hasUsername } = useAuth();
  const { inviteValidation, isValidating, hasValidInvite } =
    useInviteValidation();
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const [showGroupsOnboarding, setShowGroupsOnboarding] = useState(false);
  const { state: urlState, updateUrlState, clearFilters } = useUrlState();

  // Get festival/edition context
  const { festival, edition, isContextReady } = useFestivalEdition();

  // Fetch sets for the current edition
  const { data: sets = [], isLoading: setsLoading } = useEditionSetsQuery(
    edition?.id,
  );
  const { userVotes, handleVote } = useOfflineVoting(user);

  const { filteredAndSortedSets, lockCurrentOrder } = useSetFiltering(
    sets || [],
    urlState,
  );

  // Get profile loading state to prevent dialog flashing
  const { isLoading: profileLoading } = useProfileQuery(user?.id);

  // Get user's groups to check if they need onboarding
  const { groups } = useGroups();

  const showUsernameSetup = useMemo(() => {
    return !!user && !authLoading && !profileLoading && !hasUsername;
  }, [user, authLoading, profileLoading, hasUsername]);

  // Show groups onboarding for new authenticated users who aren't in any groups
  useEffect(() => {
    if (
      user &&
      hasUsername &&
      !authLoading &&
      !profileLoading &&
      !hasValidInvite && // Don't show if they came via invite (already know about groups)
      groups.length === 0 && // Only show if user has no groups
      !localStorage.getItem("groupsOnboardingDismissed")
    ) {
      // Small delay to let other dialogs settle
      const timer = setTimeout(() => {
        setShowGroupsOnboarding(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [user, hasUsername, authLoading, profileLoading, hasValidInvite, groups]);

  // Show loading while context is not ready
  if (!isContextReady || setsLoading) {
    return (
      <div className="min-h-screen bg-app-gradient flex items-center justify-center">
        <div className="text-white text-xl">
          {!isContextReady ? "Loading festival..." : "Loading sets..."}
        </div>
      </div>
    );
  }

  // Show loading while validating invite
  if (isValidating) {
    return (
      <div className="min-h-screen bg-app-gradient flex items-center justify-center">
        <div className="text-white text-xl">Validating invite...</div>
      </div>
    );
  }

  // If no festival or edition context, this shouldn't happen due to routing
  if (!festival || !edition) {
    return (
      <div className="min-h-screen bg-app-gradient flex items-center justify-center">
        <div className="text-white text-xl">Festival context not found</div>
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

  async function handleVoteAction(artistId: string, voteType: number) {
    const result = await handleVote(artistId, voteType);
    if (result.requiresAuth) {
      setShowAuthDialog(true);
    }
  }

  return (
    <div className="min-h-screen bg-app-gradient">
      <div className="container mx-auto px-4 py-8">
        <AppHeader
          title={festival.name}
          subtitle={edition.name}
          description={`${filteredAndSortedSets.length} artists available for voting`}
          logoUrl={festival.logo_url}
          showGroupsButton={true}
        />

        {/* Only show Groups CTA for users with no groups */}
        {groups.length === 0 && (
          <GroupsCTA onSignInClick={() => setShowAuthDialog(true)} />
        )}

        <FilterSortControls
          state={urlState}
          onStateChange={updateUrlState}
          onClear={clearFilters}
        />

        <div className="mt-8">
          <ErrorBoundary>
            {urlState.mainView === "list" && (
              <SetsPanel
                sets={filteredAndSortedSets}
                user={user}
                use24Hour={urlState.use24Hour}
                openAuthDialog={() => setShowAuthDialog(true)}
                onLockSort={() => lockCurrentOrder(updateUrlState)}
              />
            )}
            {urlState.mainView === "timeline" && (
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

        {user && (
          <UsernameSetupDialog
            open={showUsernameSetup}
            user={user}
            onSuccess={() => {
              // setShowUsernameSetup(false);
            }}
          />
        )}

        <GroupsOnboardingModal
          open={showGroupsOnboarding}
          onOpenChange={setShowGroupsOnboarding}
        />
      </div>
    </div>
  );
}
