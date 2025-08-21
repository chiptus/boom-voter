import { BarChart3, List } from "lucide-react";
import { ScheduleHorizontalTimelineView } from "@/components/schedule/ScheduleHorizontalTimelineView";
import { MobileFirstVerticalTimeline } from "@/components/schedule/vertical/MobileFirstVerticalTimeline";
import { TimelineFilters } from "./TimelineFilters";
import { useUrlState } from "@/hooks/useUrlState";

interface TimelineTabProps {
  userVotes: Record<string, number>;
  onVote: (artistId: string, voteType: number) => void;
}

export function TimelineTab({ userVotes, onVote }: TimelineTabProps) {
  const { state: urlState, updateUrlState } = useUrlState();
  const timelineView = urlState.timelineView;

  return (
    <div className="space-y-6">
      {/* Timeline View Toggle - Mobile-first */}
      <div className="flex items-center justify-center mb-4">
        <div className="bg-white/10 backdrop-blur-md rounded-lg p-1 mx-2 sm:mx-0">
          <div className="flex gap-1">
            <button
              onClick={() => updateUrlState({ timelineView: "horizontal" })}
              className={`
                flex items-center justify-center px-4 py-3 rounded-lg
                min-w-[100px] transition-all duration-200 active:scale-95
                ${
                  timelineView === "horizontal"
                    ? "bg-purple-600 text-white shadow-lg"
                    : "text-purple-200 hover:text-white hover:bg-white/10"
                }
              `}
            >
              <BarChart3 className="h-4 w-4 sm:h-5 sm:w-5" />
              <span className="ml-2 text-sm font-medium">
                <span className="sm:hidden">Grid</span>
                <span className="hidden sm:inline">Horizontal</span>
              </span>
            </button>
            <button
              onClick={() => updateUrlState({ timelineView: "list" })}
              className={`
                flex items-center justify-center px-4 py-3 rounded-lg
                min-w-[100px] transition-all duration-200 active:scale-95
                ${
                  timelineView === "list"
                    ? "bg-purple-600 text-white shadow-lg"
                    : "text-purple-200 hover:text-white hover:bg-white/10"
                }
              `}
            >
              <List className="h-4 w-4 sm:h-5 sm:w-5" />
              <span className="ml-2 text-sm font-medium">
                <span className="sm:hidden">Feed</span>
                <span className="hidden sm:inline">List</span>
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Timeline Filters */}
      <TimelineFilters />

      {/* Timeline Content */}
      {timelineView === "horizontal" ? (
        <ScheduleHorizontalTimelineView userVotes={userVotes} onVote={onVote} />
      ) : (
        <MobileFirstVerticalTimeline userVotes={userVotes} onVote={onVote} />
      )}
    </div>
  );
}
