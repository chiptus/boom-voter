import { useEffect, useRef, useState, useCallback } from "react";
import { ArtistScheduleBlock } from "./ArtistScheduleBlock";
import { DayDivider } from "./DayDivider";
import { FloatingDateIndicator } from "./FloatingDateIndicator";
import { TimelineProgress } from "./TimelineProgress";
import { DateNavigation } from "./DateNavigation";
import { useStreamingTimeline } from "@/hooks/useStreamingTimeline";
import { useScheduleData } from "@/hooks/useScheduleData";
import { format } from "date-fns";

interface ScheduleTimelineViewProps {
  userVotes: Record<string, number>;
  onVote: (artistId: string, voteType: number) => void;
}

export const ScheduleTimelineView = ({ userVotes, onVote }: ScheduleTimelineViewProps) => {
  const { streamingItems, totalArtists, loading, error } = useStreamingTimeline();
  const { scheduleDays } = useScheduleData();
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentDateIndex, setCurrentDateIndex] = useState(0);
  const [showFloatingDate, setShowFloatingDate] = useState(false);
  const [visibleItemIndex, setVisibleItemIndex] = useState(0);
  
  // Intersection Observer for tracking visible items
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const itemIndex = parseInt(entry.target.getAttribute('data-index') || '0');
            const item = streamingItems[itemIndex];
            
            setVisibleItemIndex(itemIndex);
            
            if (item?.type === 'day-divider') {
              setCurrentDateIndex(itemIndex);
              setShowFloatingDate(true);
            }
          }
        });
      },
      {
        root: container,
        rootMargin: '-20% 0px -70% 0px',
        threshold: 0.1,
      }
    );

    // Observe all items
    const items = container.querySelectorAll('[data-index]');
    items.forEach((item) => observer.observe(item));

    return () => observer.disconnect();
  }, [streamingItems]);

  const scrollToNow = useCallback(() => {
    const now = new Date();
    const nowItem = streamingItems.find(item => {
      if (item.type !== 'artist' || !item.artist?.startTime) return false;
      return item.artist.startTime <= now;
    });
    
    if (nowItem) {
      const element = containerRef.current?.querySelector(`[data-index="${nowItem.position}"]`);
      element?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [streamingItems]);

  const scrollToDate = useCallback((dateIndex: number) => {
    const dayDividerItem = streamingItems.find(item => 
      item.type === 'day-divider' && 
      item.date === scheduleDays[dateIndex]?.date
    );
    
    if (dayDividerItem) {
      const element = containerRef.current?.querySelector(`[data-index="${dayDividerItem.position}"]`);
      element?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [streamingItems, scheduleDays]);

  if (loading) {
    return (
      <div className="text-center text-purple-300 py-12">
        <p>Loading festival timeline...</p>
      </div>
    );
  }

  if (error || streamingItems.length === 0) {
    return (
      <div className="text-center text-purple-300 py-12">
        <p>No performances scheduled.</p>
      </div>
    );
  }

  const currentDate = streamingItems[currentDateIndex]?.displayDate || '';

  return (
    <div className="relative">
      <FloatingDateIndicator 
        currentDate={currentDate}
        visible={showFloatingDate && streamingItems.length > 0}
      />
      
      <div 
        ref={containerRef}
        className="max-h-[80vh] overflow-y-auto scroll-smooth"
        style={{ scrollbarWidth: 'thin' }}
      >
        <div className="space-y-4 pr-4 pb-20">
          {streamingItems.map((item, index) => (
            <div key={item.id} data-index={index}>
              {item.type === 'day-divider' ? (
                <DayDivider 
                  displayDate={item.displayDate!}
                  isFirst={index === 0}
                />
              ) : (
                <div className="flex gap-4 items-start">
                  <div className="flex-shrink-0 w-20 text-right">
                    <div className="text-sm font-medium text-purple-300">
                      {item.artist?.startTime ? format(item.artist.startTime, 'HH:mm') : '--:--'}
                    </div>
                    {item.artist?.endTime && (
                      <div className="text-xs text-purple-400">
                        {format(item.artist.endTime, 'HH:mm')}
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-shrink-0 w-2 flex justify-center">
                    <div className="w-3 h-3 bg-purple-400 rounded-full mt-2"></div>
                  </div>
                  
                  <div className="flex-1 pb-4">
                    <ArtistScheduleBlock
                      artist={item.artist!}
                      userVote={userVotes[item.artist!.id]}
                      onVote={onVote}
                    />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <TimelineProgress
        currentPosition={visibleItemIndex}
        totalItems={streamingItems.length}
        visible={streamingItems.length > 10}
      />
      
      <DateNavigation
        onScrollToDate={scrollToDate}
        onScrollToNow={scrollToNow}
        containerRef={containerRef}
      />
    </div>
  );
};