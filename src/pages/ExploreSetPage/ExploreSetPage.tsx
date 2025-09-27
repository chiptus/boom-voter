import { useNavigate } from "react-router-dom";
import { useFestivalEdition } from "@/contexts/FestivalEditionContext";
import { LoadingState } from "./components/LoadingState";
import { EmptyState } from "./components/EmptyState";
import { ExplorePageHeader } from "./components/ExplorePageHeader";
import { CardStackContainer } from "./components/CardStackContainer";
import { VotingSection } from "./components/VotingSection";
import { useAuth } from "@/contexts/AuthContext";
import { useVote } from "@/hooks/queries/voting/useVote";
import { useUserVotes } from "@/hooks/queries/voting/useUserVotes";
import { useSetsByEditionQuery } from "@/hooks/queries/sets/useSetsByEdition";
import { useMemo, useState } from "react";

export function ExploreSetPage() {
  const { edition, basePath } = useFestivalEdition();
  const navigate = useNavigate();
  const { user, showAuthDialog } = useAuth();
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
        set.artists &&
        set.artists.length > 0 &&
        set.name &&
        set.artists[0].soundcloud_url,
    );
  }, [allSets]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState<"left" | "right" | null>(null);
  const [dragFeedback, setDragFeedback] = useState<{
    direction: "left" | "right" | null;
    intensity: number;
  }>({ direction: null, intensity: 0 });

  const currentSet = explorableSets[currentIndex];
  const isLastSet = currentIndex >= explorableSets.length - 1;

  async function handleVote(voteType: number) {
    if (!currentSet) return;

    if (!user) {
      showAuthDialog();
      return;
    }

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
          navigate(`${basePath}/sets`);
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

  function handleDragUpdate(
    direction: "left" | "right" | null,
    intensity: number,
  ) {
    setDragFeedback({ direction, intensity });
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
    return <LoadingState />;
  }

  const totalSets = explorableSets.length;
  const nextSet = !isLastSet ? explorableSets[currentIndex + 1] : undefined;

  if (!edition || totalSets === 0) {
    return <EmptyState onGoBack={() => navigate(-1)} />;
  }

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-purple-900 to-black">
      {/* Header */}
      <ExplorePageHeader
        basePath={basePath}
        editionName={edition.name}
        currentIndex={currentIndex}
        totalSets={totalSets}
      />

      {/* Card Stack */}
      <CardStackContainer
        currentSet={currentSet}
        nextSet={nextSet}
        direction={direction}
        onSwipe={handleSwipe}
        onDragUpdate={handleDragUpdate}
        isLastSet={isLastSet}
      />

      {/* Voting Actions */}
      <VotingSection
        currentSet={currentSet}
        onVote={handleVote}
        onSkip={handleSkip}
        dragFeedback={dragFeedback}
      />
    </div>
  );
}
