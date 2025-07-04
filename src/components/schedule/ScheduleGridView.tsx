import { ArtistScheduleBlock } from "./ArtistScheduleBlock";
import { DayDivider } from "./DayDivider";
import { useStreamingTimeline } from "@/hooks/useStreamingTimeline";
import { useMemo } from "react";

interface ScheduleGridViewProps {
  userVotes: Record<string, number>;
  onVote: (artistId: string, voteType: number) => void;
}

export const ScheduleGridView = ({ userVotes, onVote }: ScheduleGridViewProps) => {
  const { streamingItems, loading, error } = useStreamingTimeline();

  // Group streaming items by day for grid layout
  const dayGroups = useMemo(() => {
    const groups: Array<{ 
      dayDivider: any; 
      stages: Record<string, any[]>; 
    }> = [];
    
    let currentGroup: { dayDivider: any; stages: Record<string, any[]> } | null = null;

    streamingItems.forEach(item => {
      if (item.type === 'day-divider') {
        if (currentGroup) {
          groups.push(currentGroup);
        }
        currentGroup = {
          dayDivider: item,
          stages: {}
        };
      } else if (item.type === 'artist' && currentGroup && item.artist) {
        const stageName = item.artist.stage || 'Main Stage';
        if (!currentGroup.stages[stageName]) {
          currentGroup.stages[stageName] = [];
        }
        currentGroup.stages[stageName].push(item.artist);
      }
    });

    if (currentGroup) {
      groups.push(currentGroup);
    }

    return groups;
  }, [streamingItems]);

  if (loading) {
    return (
      <div className="text-center text-purple-300 py-12">
        <p>Loading schedule...</p>
      </div>
    );
  }

  if (error || dayGroups.length === 0) {
    return (
      <div className="text-center text-purple-300 py-12">
        <p>No performances scheduled.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {dayGroups.map((group, groupIndex) => (
        <div key={group.dayDivider.id}>
          <DayDivider
            displayDate={group.dayDivider.displayDate}
            isFirst={groupIndex === 0}
          />
          
          <div className="space-y-6 mt-6">
            {Object.entries(group.stages).map(([stageName, stageArtists]) => (
              <div key={stageName} className="space-y-4">
                <h3 className="text-2xl font-bold text-white border-b border-purple-400/30 pb-2">
                  {stageName}
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {stageArtists.map((artist) => (
                    <ArtistScheduleBlock
                      key={artist.id}
                      artist={artist}
                      userVote={userVotes[artist.id]}
                      onVote={onVote}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};