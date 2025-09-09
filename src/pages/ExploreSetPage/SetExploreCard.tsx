import { FestivalSet } from "@/hooks/queries/sets/useSets";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Users } from "lucide-react";
import { motion, PanInfo } from "framer-motion";
import { useState } from "react";
import { StageBadge } from "@/components/StageBadge";
import { useStageQuery } from "@/hooks/queries/stages/useStageQuery";

interface SetExploreCardProps {
  set: FestivalSet;
  onSwipe?: (direction: "left" | "right") => void;
  onTap?: () => void;
  onDragUpdate?: (
    direction: "left" | "right" | null,
    intensity: number,
  ) => void;
}

export function SetExploreCard({
  set,
  onSwipe,
  onTap,
  onDragUpdate,
}: SetExploreCardProps) {
  const stageQuery = useStageQuery(set.stage_id);
  const [imageLoaded, setImageLoaded] = useState(false);

  function handleDragEnd(
    _event: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo,
  ) {
    // Reset drag feedback
    onDragUpdate?.(null, 0);

    const swipeThreshold = 100;
    const velocityThreshold = 500;

    if (
      Math.abs(info.offset.x) > swipeThreshold ||
      Math.abs(info.velocity.x) > velocityThreshold
    ) {
      if (info.offset.x > 0) {
        onSwipe?.("right");
      } else {
        onSwipe?.("left");
      }
    }
  }

  function handleDrag(
    _event: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo,
  ) {
    const dragDistance = Math.abs(info.offset.x);
    const maxDistance = 150; // Max distance for full intensity
    const intensity = Math.min(dragDistance / maxDistance, 1);

    if (dragDistance > 10) {
      // Minimum drag threshold
      const direction = info.offset.x > 0 ? "right" : "left";
      onDragUpdate?.(direction, intensity);
    } else {
      onDragUpdate?.(null, 0);
    }
  }

  // Get primary artist (first artist) for main display
  const primaryArtist = set.artists[0];
  const supportingArtists = set.artists.slice(1);

  // Format time display
  function formatTime(dateString: string | null) {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  }

  // Format date display
  function formatDate(dateString: string | null) {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  }

  return (
    <motion.div
      className="h-full w-full cursor-grab active:cursor-grabbing"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.7}
      onDrag={handleDrag}
      onDragEnd={handleDragEnd}
      onClick={onTap}
      transition={{ duration: 0.2 }}
    >
      <Card className="h-full w-full overflow-hidden bg-gradient-to-b from-gray-900 to-black border-gray-800 shadow-2xl">
        {/* Background Image */}
        <div className="relative h-full">
          {primaryArtist?.image_url && (
            <>
              <img
                src={primaryArtist.image_url}
                alt={primaryArtist.name}
                className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
                  imageLoaded ? "opacity-30" : "opacity-0"
                }`}
                onLoad={() => setImageLoaded(true)}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent" />
            </>
          )}

          {/* Content */}
          <div className="relative h-full flex flex-col justify-between p-6 text-white">
            {/* Header Info */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Badge
                  variant="secondary"
                  className="bg-purple-600/80 text-white border-0"
                >
                  {formatDate(set.time_start)}
                </Badge>
                {set.time_start && (
                  <div className="flex items-center text-sm text-gray-300">
                    <Clock className="h-4 w-4 mr-1" />
                    {formatTime(set.time_start)}
                  </div>
                )}
              </div>

              {stageQuery.data && (
                <StageBadge
                  stageName={stageQuery.data.name}
                  stageColor={stageQuery.data.color || undefined}
                  size="sm"
                />
              )}
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col justify-center space-y-4">
              {/* Set Name */}
              <div className="text-center">
                <h2 className="text-2xl font-bold mb-2">{set.name}</h2>
              </div>

              {/* Primary Artist */}
              <div className="text-center space-y-2">
                <div className="w-20 h-20 mx-auto rounded-full overflow-hidden border-4 border-white/20">
                  {primaryArtist?.image_url ? (
                    <img
                      src={primaryArtist.image_url}
                      alt={primaryArtist.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center">
                      <Users className="h-8 w-8 text-white" />
                    </div>
                  )}
                </div>
                <h3 className="text-xl font-semibold">{primaryArtist?.name}</h3>
                {primaryArtist?.description && (
                  <p className="text-sm text-gray-300 line-clamp-2">
                    {primaryArtist.description}
                  </p>
                )}
              </div>

              {/* Supporting Artists */}
              {supportingArtists.length > 0 && (
                <div className="space-y-2">
                  <p className="text-center text-sm text-gray-400">
                    {supportingArtists.length === 1 ? "With" : "With"}
                  </p>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {supportingArtists.slice(0, 3).map((artist) => (
                      <Badge
                        key={artist.id}
                        variant="outline"
                        className="bg-white/10 text-white border-white/20 text-xs"
                      >
                        {artist.name}
                      </Badge>
                    ))}
                    {supportingArtists.length > 3 && (
                      <Badge
                        variant="outline"
                        className="bg-white/10 text-white border-white/20 text-xs"
                      >
                        +{supportingArtists.length - 3} more
                      </Badge>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="text-center">
              <p className="text-sm text-gray-400">
                Swipe or tap buttons to vote
              </p>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
