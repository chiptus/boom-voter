import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useVoting } from "@/hooks/queries/useVotingQuery";
import { useUrlState } from "@/hooks/useUrlState";
import { useScheduleData } from "@/hooks/useScheduleData";
import { ScheduleHeader } from "@/components/schedule/ScheduleHeader";
import { DaySelector } from "@/components/schedule/DaySelector";
import { ScheduleGridView } from "@/components/schedule/ScheduleGridView";
import { ScheduleTimelineView } from "@/components/schedule/ScheduleTimelineView";
import { ScheduleListView } from "@/components/schedule/ScheduleListView";
import { AuthDialog } from "@/components/AuthDialog";

const Schedule = () => {
  const { user } = useAuth();
  const { userVotes, handleVote } = useVoting();
  const { state: urlState, updateUrlState } = useUrlState();
  const { scheduleDays, loading, error } = useScheduleData();
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
          <div className="mb-6">
            <Link to="/">
              <Button variant="outline" className="border-purple-400 text-purple-400 hover:bg-purple-400 hover:text-white">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Artists
              </Button>
            </Link>
          </div>
          
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
        <div className="mb-6">
          <Link to="/">
            <Button variant="outline" className="border-purple-400 text-purple-400 hover:bg-purple-400 hover:text-white">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Artists
            </Button>
          </Link>
        </div>

        <ScheduleHeader
          view={urlState.scheduleView}
          onViewChange={(view) => updateUrlState({ scheduleView: view })}
          totalPerformances={totalPerformances}
        />

        <DaySelector
          days={scheduleDays}
          selectedDay={selectedDay}
          onDayChange={setSelectedDay}
        />

        {currentDay && (
          <div className="mt-8">
            {urlState.scheduleView === 'grid' && (
              <ScheduleGridView
                day={currentDay}
                userVotes={userVotes}
                onVote={handleVoteAction}
              />
            )}
            {urlState.scheduleView === 'timeline' && (
              <ScheduleTimelineView
                day={currentDay}
                userVotes={userVotes}
                onVote={handleVoteAction}
              />
            )}
            {urlState.scheduleView === 'list' && (
              <ScheduleListView
                day={currentDay}
                userVotes={userVotes}
                onVote={handleVoteAction}
              />
            )}
          </div>
        )}

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