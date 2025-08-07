import { createContext, PropsWithChildren, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { type Festival, type FestivalEdition } from "@/services/queries";
import {
  useFestivalEditionQuery,
  useFestivalQuery,
} from "@/hooks/queries/useFestivalQuery";

interface FestivalEditionContextType {
  // Current state
  festival: Festival | null;
  edition: FestivalEdition | null;

  // Actions
  setContext: (festivalId: string, editionId?: string) => void;

  // Utils
  isContextReady: boolean;
}

const FestivalEditionContext = createContext<
  FestivalEditionContextType | undefined
>(undefined);

export const useFestivalEdition = () => {
  const context = useContext(FestivalEditionContext);
  if (context === undefined) {
    throw new Error(
      "useFestivalEdition must be used within a FestivalEditionProvider",
    );
  }
  return context;
};

export function FestivalEditionProvider({
  children,
}: PropsWithChildren<unknown>) {
  const navigate = useNavigate();
  const { festivalId, editionId } = useParams<{
    festivalId?: string;
    editionId?: string;
  }>();

  const festivalQuery = useFestivalQuery(festivalId);

  const editionQuery = useFestivalEditionQuery({
    festivalId,
    editionId,
  });

  const festival = festivalQuery.data;
  const edition = editionQuery.data;

  const setContext = (festivalId: string, editionId?: string) => {
    if (editionId) {
      navigate(`/festivals/${festivalId}/editions/${editionId}`);
    } else {
      navigate(`/festivals/${festivalId}`);
    }
  };

  const isContextReady = !!(
    // Either we're on root (no context needed)
    (
      (!festivalId && !editionId) ||
      // Or we have valid festival context
      (festivalId && festival) ||
      // Or we have valid edition context
      (editionId && edition && festival)
    )
  );

  const contextValue: FestivalEditionContextType = {
    festival: festival || null,
    edition: edition || null,
    setContext,
    isContextReady,
  };

  return (
    <FestivalEditionContext.Provider value={contextValue}>
      {children}
    </FestivalEditionContext.Provider>
  );
}
