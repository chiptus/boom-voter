import { useMemo } from "react";
import { useScheduleData } from "@/hooks/useScheduleData";
import { useFestivalEdition } from "@/contexts/FestivalEditionContext";
import { useSetsByEditionQuery as useEditionSetsQuery } from "@/hooks/queries/sets/useSetsByEdition";
import { format, isSameDay } from "date-fns";
import { TimeSlotGroup } from "./TimeSlotGroup";
import type { ScheduleSet } from "@/hooks/useScheduleData";

interface MobileFirstVerticalTimelineProps {
  userVotes: Record<string, number>;
  onVote: (artistId: string, voteType: number) => void;
}

interface TimeSlot {
  time: Date;
  sets: ScheduleSet[];
}

export function MobileFirstVerticalTimeline({
  userVotes,
  onVote,
}: MobileFirstVerticalTimelineProps) {
  const { edition } = useFestivalEdition();
  const { data: editionSets = [], isLoading: setsLoading } =
    useEditionSetsQuery(edition?.id);
  const { scheduleDays, loading, error } = useScheduleData(editionSets);

  const timeSlots = useMemo(() => {
    if (!scheduleDays.length) return [];

    // Collect all unique start times
    const allSets: (ScheduleSet & { stageName: string })[] = [];
    
    scheduleDays.forEach(day => {
      day.stages.forEach(stage => {
        stage.sets.forEach(set => {
          if (set.startTime) {
            allSets.push({
              ...set,
              stageName: stage.name
            });
          }
        });
      });
    });

    // Group sets by start time
    const timeGroups = new Map<string, (ScheduleSet & { stageName: string })[]>();
    
    allSets.forEach(set => {
      if (!set.startTime) return;
      
      const timeKey = set.startTime.toISOString();
      if (!timeGroups.has(timeKey)) {
        timeGroups.set(timeKey, []);
      }
      timeGroups.get(timeKey)!.push(set);
    });

    // Convert to sorted array
    const slots: TimeSlot[] = Array.from(timeGroups.entries())
      .map(([timeKey, sets]) => ({
        time: new Date(timeKey),
        sets: sets.map(({ stageName, ...set }) => ({ ...set, stageName }))
      }))
      .sort((a, b) => a.time.getTime() - b.time.getTime());

    return slots;
  }, [scheduleDays]);

  if (loading || setsLoading) {
    return (
      <div className="text-center text-purple-300 py-12">
        <p>Loading schedule...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-purple-300 py-12">
        <p>Error loading schedule.</p>
      </div>
    );
  }

  if (!edition?.published) {
    return (
      <div className="text-center text-purple-300 py-12">
        <p>Schedule not yet published.</p>
      </div>
    );
  }

  if (!timeSlots.length) {
    return (
      <div className="text-center text-purple-300 py-12">
        <p>No scheduled sets found.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {timeSlots.map((slot, index) => {
        const prevSlot = index > 0 ? timeSlots[index - 1] : null;
        const showDateHeader = !prevSlot || !isSameDay(slot.time, prevSlot.time);
        
        return (
          <TimeSlotGroup
            key={slot.time.toISOString()}
            timeSlot={slot}
            showDateHeader={showDateHeader}
            userVotes={userVotes}
            onVote={onVote}
          />
        );
      })}
    </div>
  );
}