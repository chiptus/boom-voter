import { useNavigate } from "react-router-dom";
import { useSetsByEditionQuery } from "@/hooks/queries/sets/useSetsByEdition";
import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Info } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { SetExploreCard } from "./SetExploreCard";
import { ExplorationProgress } from "./ExplorationProgress";
import { VotingActions } from "./VotingActions";
import { motion, AnimatePresence } from "framer-motion";
import { useFestivalEdition } from "@/contexts/FestivalEditionContext";
import { useVote } from "@/hooks/queries/voting/useVote";
import { useUserVotes } from "@/hooks/queries/voting/useUserVotes";

export function ExploreSetPage() {
  const { edition } = useFestivalEdition();
  const navigate = useNavigate();
  const { user } = useAuth();
  const voteMutation = useVote();
  const { data: userVotes = {} } = useUserVotes(user?.id || "");

  // Fetch edition and sets data
  const { data: allSets = [], isLoading: setsLoading } = useSetsByEditionQuery(
    edition?.id,
  );

  // Filter to sets with artists and valid data
  const explorableSets = useMemo(() => {
    return allSets.filter(
      (set) =>
        set.artists && set.artists.length > 0 && set.name && set.time_start,
    );
  }, [allSets]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState<"left" | "right" | null>(null);

  const currentSet = explorableSets[currentIndex];
  const isLastSet = currentIndex >= explorableSets.length - 1;

  async function handleVote(voteType: number) {
    if (!currentSet || !user) return;

    const existingVote = userVotes[currentSet.id];

    try {
      await voteMutation.mutateAsync({
        setId: currentSet.id,
        voteType,
        userId: user.id,
        existingVote,
      });

      // Set direction based on vote type for animation
      setDirection(voteType >= 1 ? "right" : "left");

      // Move to next set after animation
      setTimeout(() => {
        if (isLastSet) {
          // Navigate back or show completion screen
          navigate(-1);
        } else {
          setCurrentIndex((prev) => prev + 1);
          setDirection(null);
        }
      }, 300);
    } catch (error) {
      console.error("Failed to vote:", error);
    }
  }

  function handleSwipe(direction: "left" | "right") {
    if (direction === "left") {
      handleVote(-1); // Won't Go
    } else {
      handleVote(1); // Interested
    }
  }

  function handleSkip() {
    setDirection("left");
    setTimeout(() => {
      if (isLastSet) {
        navigate(-1);
      } else {
        setCurrentIndex((prev) => prev + 1);
        setDirection(null);
      }
    }, 300);
  }

  if (setsLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-900 to-black flex items-center justify-center">
        <div className="text-white text-xl">Loading sets...</div>
      </div>
    );
  }

  if (!edition || explorableSets.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-900 to-black flex flex-col items-center justify-center p-4">
        <div className="text-white text-center">
          <h1 className="text-2xl font-bold mb-4">No Sets Available</h1>
          <p className="mb-6">
            There are no sets to explore for this festival edition.
          </p>
          <Button onClick={() => navigate(-1)} variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-900 to-black">
      {/* Header */}
      <div className="relative z-10 p-4 flex items-center justify-between">
        <Button
          onClick={() => navigate(-1)}
          variant="ghost"
          size="sm"
          className="text-white hover:bg-white/20"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>

        <div className="text-center text-white">
          <h1 className="font-semibold">{edition.name}</h1>
          <ExplorationProgress
            current={currentIndex + 1}
            total={explorableSets.length}
          />
        </div>

        <Button
          variant="ghost"
          size="sm"
          className="text-white hover:bg-white/20"
        >
          <Info className="h-4 w-4" />
        </Button>
      </div>

      {/* Card Stack */}
      <div className="relative flex-1 px-4 pb-32">
        <div className="relative h-[60vh] max-w-sm mx-auto">
          <AnimatePresence mode="wait">
            {currentSet && (
              <motion.div
                key={currentSet.id}
                initial={{
                  scale: 0.8,
                  opacity: 0,
                  rotateY: direction === "left" ? -90 : 90,
                }}
                animate={{ scale: 1, opacity: 1, rotateY: 0 }}
                exit={{
                  scale: 0.8,
                  opacity: 0,
                  x: direction === "left" ? -300 : 300,
                  rotateZ: direction === "left" ? -30 : 30,
                }}
                transition={{
                  duration: 0.3,
                  ease: "easeOut",
                }}
                className="absolute inset-0"
              >
                <SetExploreCard set={currentSet} onSwipe={handleSwipe} />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Preview next card */}
          {!isLastSet && explorableSets[currentIndex + 1] && (
            <div className="absolute inset-0 -z-10 scale-95 opacity-50">
              <SetExploreCard set={explorableSets[currentIndex + 1]} />
            </div>
          )}
        </div>
      </div>

      {/* Voting Actions */}
      {currentSet && user && (
        <div className="fixed bottom-8 left-0 right-0 z-20">
          <VotingActions
            setId={currentSet.id}
            userId={user.id}
            onVote={handleVote}
            onSkip={handleSkip}
          />
        </div>
      )}
    </div>
  );
}
