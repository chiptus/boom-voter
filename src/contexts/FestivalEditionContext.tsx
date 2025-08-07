import { createContext, PropsWithChildren, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { type Festival, type FestivalEdition } from "@/services/queries";
import {
  useFestivalEditionBySlugQuery,
  useFestivalBySlugQuery,
} from "@/hooks/queries/useFestivalQuery";

interface FestivalEditionContextType {
  // Current state
  festival: Festival | null;
  edition: FestivalEdition | null;

  // Actions
  setContext: (festivalSlug: string, editionSlug?: string) => void;

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
  const { festivalSlug, editionSlug } = useParams<{
    festivalSlug?: string;
    editionSlug?: string;
  }>();

  const festivalQuery = useFestivalBySlugQuery(festivalSlug);

  const editionQuery = useFestivalEditionBySlugQuery({
    festivalSlug,
    editionSlug,
  });

  const festival = festivalQuery.data;
  const edition = editionQuery.data;

  const setContext = (festivalSlug: string, editionSlug?: string) => {
    if (editionSlug) {
      navigate(`/festivals/${festivalSlug}/editions/${editionSlug}`);
    } else {
      navigate(`/festivals/${festivalSlug}`);
    }
  };

  const isContextReady = !!(
    // Either we're on root (no context needed)
    (
      (!festivalSlug && !editionSlug) ||
      // Or we have valid festival context
      (festivalSlug && festival) ||
      // Or we have valid edition context
      (editionSlug && edition && festival)
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
