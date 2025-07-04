import { useEffect, useRef, useState, useCallback } from "react";
import { ArtistScheduleBlock } from "./ArtistScheduleBlock";
import { DayDivider } from "./DayDivider";
import { FloatingDateIndicator } from "./FloatingDateIndicator";
import { TimelineProgress } from "./TimelineProgress";
import { DateNavigation } from "./DateNavigation";
import { useStreamingTimeline } from "@/hooks/useStreamingTimeline";
import { useScheduleData } from "@/hooks/useScheduleData";
import { format } from "date-fns";
import ErrorBoundary from "../ErrorBoundary";

interface ScheduleTimelineViewProps {
  userVotes: Record<string, number>;
  onVote: (artistId: string, voteType: number) => void;
}

export const ScheduleTimelineView = ({ userVotes, onVote }: ScheduleTimelineViewProps) => {
  const { streamingItems, totalArtists, loading, error } = useStreamingTimeline();
  const { scheduleDays } = useScheduleData();
  const containerRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const [currentDateIndex, setCurrentDateIndex] = useState(0);
  const [showFloatingDate, setShowFloatingDate] = useState(false);
  const [visibleItemIndex, setVisibleItemIndex] = useState(0);
  
  // Enhanced Intersection Observer with proper cleanup
  useEffect(() => {
    const container = containerRef.current;
    if (!container || !streamingItems || streamingItems.length === 0) {
      console.log('ScheduleTimelineView - Container or streamingItems not ready');
      return;
    }

    // Clean up existing observer
    if (observerRef.current) {
      observerRef.current.disconnect();
      observerRef.current = null;
    }

    try {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const itemIndex = parseInt(entry.target.getAttribute('data-index') || '0');
              
              // Defensive check for item existence
              if (itemIndex >= 0 && itemIndex < streamingItems.length) {
                const item = streamingItems[itemIndex];
                
                setVisibleItemIndex(itemIndex);
                
                if (item?.type === 'day-divider') {
                  setCurrentDateIndex(itemIndex);
                  setShowFloatingDate(true);
                }
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

      observerRef.current = observer;

      // Observe all items with defensive checks
      const items = container.querySelectorAll('[data-index]');
      if (items.length > 0) {
        items.forEach((item) => observer.observe(item));
        console.log('ScheduleTimelineView - Observing', items.length, 'items');
      }
    } catch (err) {
      console.error('ScheduleTimelineView - Error setting up intersection observer:', err);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
        observerRef.current = null;
      }
    };
  }, [streamingItems]);

  const scrollToNow = useCallback(() => {
    if (!streamingItems || streamingItems.length === 0) return;
    
    const now = new Date();
    const nowItem = streamingItems.find(item => {
      if (item.type !== 'artist' || !item.artist?.startTime) return false;
      return item.artist.startTime <= now;
    });
    
    if (nowItem && containerRef.current) {
      const element = containerRef.current.querySelector(`[data-index="${nowItem.position}"]`);
      element?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [streamingItems]);

  const scrollToDate = useCallback((dateIndex: number) => {
    if (!streamingItems || streamingItems.length === 0 || !scheduleDays || dateIndex >= scheduleDays.length) return;
    
    const dayDividerItem = streamingItems.find(item => 
      item.type === 'day-divider' && 
      item.date === scheduleDays[dateIndex]?.date
    );
    
    if (dayDividerItem && containerRef.current) {
      const element = containerRef.current.querySelector(`[data-index="${dayDividerItem.position}"]`);
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

  if (error) {
    console.error('ScheduleTimelineView - Error:', error);
    return (
      <div className="text-center text-purple-300 py-12">
        <p>Error loading schedule. Please try refreshing.</p>
        <button 
          onClick={() => window.location.reload()} 
          className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
        >
          Refresh
        </button>
      </div>
    );
  }

  if (!streamingItems || streamingItems.length === 0) {
    console.log('ScheduleTimelineView - No streaming items available');
    return (
      <div className="text-center text-purple-300 py-12">
        <p>No performances scheduled.</p>
      </div>
    );
  }

  const currentDate = streamingItems[currentDateIndex]?.displayDate || '';

  return (
    <ErrorBoundary>
      <div className="relative">
        <FloatingDateIndicator 
          currentDate={currentDate}
          visible={showFloatingDate && streamingItems.length > 0}
        />
        
        <DateNavigation
          onScrollToDate={scrollToDate}
          onScrollToNow={scrollToNow}
          containerRef={containerRef}
        />
        
        <div 
          ref={containerRef}
          className="max-h-[80vh] overflow-y-auto scroll-smooth"
          style={{ scrollbarWidth: 'thin' }}
        >
          <div className="space-y-4 pr-4 pb-20">
            {streamingItems.map((item, index) => {
              if (!item) {
                console.warn('ScheduleTimelineView - Invalid item at index:', index);
                return null;
              }
              
              return (
                <div key={item.id} data-index={index}>
                  {item.type === 'day-divider' ? (
                    <DayDivider 
                      displayDate={item.displayDate || 'Unknown Date'}
                      isFirst={index === 0}
                    />
                  ) : item.artist ? (
                    <div className="flex gap-4 items-start">
                      <div className="flex-shrink-0 w-20 text-right">
                        <div className="text-sm font-medium text-purple-300">
                          {item.artist.startTime ? format(item.artist.startTime, 'HH:mm') : '--:--'}
                        </div>
                        {item.artist.endTime && (
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
                          artist={item.artist}
                          userVote={userVotes[item.artist.id] || 0}
                          onVote={onVote}
                        />
                      </div>
                    </div>
                  ) : null}
                </div>
              );
            })}
          </div>
        </div>

        <TimelineProgress
          currentPosition={visibleItemIndex}
          totalItems={streamingItems.length}
          visible={streamingItems.length > 10}
        />
      </div>
    </ErrorBoundary>
  );
};