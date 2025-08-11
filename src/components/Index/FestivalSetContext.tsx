import { createContext, useContext, ReactNode } from "react";
import { FestivalSet } from "@/services/queries";

interface FestivalSetContextValue {
  set: FestivalSet;
  userVote?: number;
  userKnowledge?: boolean;
  votingLoading?: boolean;
  onVote: (
    setId: string,
    voteType: number,
  ) => Promise<{ requiresAuth: boolean }>;
  onKnowledgeToggle: (setId: string) => Promise<{ requiresAuth: boolean }>;
  onAuthRequired: () => void;
  use24Hour?: boolean;

  // Computed helpers
  isMultiArtist: boolean;
  getVoteCount: (voteType: number) => number;
}

const FestivalSetContext = createContext<FestivalSetContextValue | null>(null);

interface FestivalSetProviderProps {
  children: ReactNode;
  set: FestivalSet;
  userVote?: number;
  userKnowledge?: boolean;
  votingLoading?: boolean;
  onVote: (
    setId: string,
    voteType: number,
  ) => Promise<{ requiresAuth: boolean }>;
  onKnowledgeToggle: (setId: string) => Promise<{ requiresAuth: boolean }>;
  onAuthRequired: () => void;
  use24Hour?: boolean;
}

export function FestivalSetProvider({
  children,
  set,
  userVote,
  userKnowledge,
  votingLoading,
  onVote,
  onKnowledgeToggle,
  onAuthRequired,
  use24Hour = false,
}: FestivalSetProviderProps) {
  const isMultiArtist = set.artists.length > 1;

  function getVoteCount(voteType: number) {
    return set.votes.filter((vc) => vc.vote_type === voteType).length || 0;
  }

  const contextValue: FestivalSetContextValue = {
    set,
    userVote,
    userKnowledge,
    votingLoading,
    onVote,
    onKnowledgeToggle,
    onAuthRequired,
    use24Hour,
    isMultiArtist,
    getVoteCount,
  };

  return (
    <FestivalSetContext.Provider value={contextValue}>
      {children}
    </FestivalSetContext.Provider>
  );
}

export function useFestivalSet() {
  const context = useContext(FestivalSetContext);
  if (!context) {
    throw new Error("useFestivalSet must be used within a FestivalSetProvider");
  }
  return context;
}
