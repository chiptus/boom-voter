import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useOfflineVoting } from "@/hooks/useOfflineVoting";
import { useUrlState } from "@/hooks/useUrlState";
import { useScheduleData } from "@/hooks/useScheduleData";
import { AppHeader } from "@/components/AppHeader";
import { ScheduleViewToggle } from "@/components/schedule/ScheduleViewToggle";
import { ScheduleGridView } from "@/components/schedule/ScheduleGridView";
import { ScheduleTimelineView } from "@/components/schedule/ScheduleTimelineView";
import { ScheduleListView } from "@/components/schedule/ScheduleListView";
import { ScheduleHorizontalTimelineView } from "@/components/schedule/ScheduleHorizontalTimelineView";
import { AuthDialog } from "@/components/AuthDialog";
import ErrorBoundary from "@/components/ErrorBoundary";

const Schedule = () => {
  const { user } = useAuth();
  const { userVotes, handleVote } = useOfflineVoting(user);
  const { state: urlState, updateUrlState } = useUrlState();
  const { scheduleDays, loading, error } = useScheduleData(urlState.use24Hour);
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const [selectedDay, setSelectedDay] = useState<string>(
    scheduleDays.length > 0 ? scheduleDays[0].date : ''
  );

  // Update selectedDay when scheduleDays loads
  if (scheduleDays.length > 0 && !selectedDay) {
    setSelectedDay(scheduleDays[0].date);
  }

  const handleVoteAction = async (artistId: string, voteType: number) => {
    const result = await handleVote(artistId, voteType);
    if (result.requiresAuth) {
      setShowAuthDialog(true);
    }
  };

  const currentDay = scheduleDays.find(day => day.date === selectedDay);
  const totalPerformances = scheduleDays.reduce(
    (total, day) => total + day.stages.reduce((stageTotal, stage) => stageTotal + stage.artists.length, 0),
    0
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading schedule...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-white text-xl">Error loading schedule. Please try again.</div>
      </div>
    );
  }

  if (scheduleDays.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
        <div className="container mx-auto px-4 py-8">
          <AppHeader 
            showBackButton
            backTo="/"
            backLabel="Back to Artists"
          />
          
          <div className="text-center text-white py-12">
            <h1 className="text-4xl font-bold mb-4">Festival Schedule</h1>
            <p className="text-xl text-purple-200">No performances scheduled yet.</p>
            <p className="text-purple-300 mt-2">Check back later for updates!</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <div className="container mx-auto px-4 py-8">
        <AppHeader 
          showBackButton
          backTo="/"
          backLabel="Back to Artists"
          title="Festival Schedule"
          subtitle="Plan your festival experience"
          description={`${totalPerformances} performances scheduled`}
          actions={
            <ScheduleViewToggle 
              view={urlState.scheduleView} 
              onViewChange={(view) => updateUrlState({ scheduleView: view })} 
            />
          }
        />

        <div className="mt-8">
          <ErrorBoundary>
            {urlState.scheduleView === 'grid' && (
              <ScheduleGridView
                userVotes={userVotes}
                onVote={handleVoteAction}
              />
            )}
            {urlState.scheduleView === 'timeline' && (
              <ScheduleTimelineView
                userVotes={userVotes}
                onVote={handleVoteAction}
              />
            )}
            {urlState.scheduleView === 'list' && (
              <ScheduleListView
                userVotes={userVotes}
                onVote={handleVoteAction}
              />
            )}
            {urlState.scheduleView === 'horizontal' && (
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
        />
      </div>
    </div>
  );
};

export default Schedule;