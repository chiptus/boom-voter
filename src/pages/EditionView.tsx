import { useAuth } from "@/contexts/AuthContext";

import { FilterSortControls } from "@/components/Index/filters/FilterSortControls";
import { AppHeader } from "@/components/AppHeader";
import { useSetFiltering } from "@/components/Index/useSetFiltering";
import { useOfflineVoting } from "@/hooks/useOfflineVoting";
import { useUrlState } from "@/hooks/useUrlState";
import { SetsPanel } from "@/components/Index/SetsPanel";
import { ScheduleHorizontalTimelineView } from "@/components/schedule/ScheduleHorizontalTimelineView";
import ErrorBoundary from "@/components/ErrorBoundary";
import { useEditionSetsQuery } from "@/hooks/queries/useEditionSetsQuery";
import { useFestivalEdition } from "@/contexts/FestivalEditionContext";

export default function EditionView() {
  const { user, showAuthDialog } = useAuth();

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

  // Show loading while context is not ready
  if (!isContextReady) {
    return (
      <div className="min-h-screen bg-app-gradient flex items-center justify-center">
        <div className="text-white text-xl">Loading festival...</div>
      </div>
    );
  }

  if (!festival || !edition || setsLoading) {
    return (
      <div className="min-h-screen bg-app-gradient flex items-center justify-center">
        <div className="text-white text-xl">Loading sets...</div>
      </div>
    );
  }

  async function handleVoteAction(artistId: string, voteType: number) {
    const result = await handleVote(artistId, voteType);
    if (result.requiresAuth) {
      showAuthDialog();
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
                openAuthDialog={() => showAuthDialog()}
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
      </div>
    </div>
  );
}
