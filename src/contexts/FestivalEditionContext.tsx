import { createContext, PropsWithChildren, useContext } from "react";
import { useNavigate, matchPath } from "react-router-dom";
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

function getSlugs({
  propFestivalSlug,
  isSubDomain,
}: {
  propFestivalSlug?: string;
  isSubDomain?: boolean;
}) {
  if (!location.pathname.includes("/editions")) {
    return {
      festivalSlug: propFestivalSlug,
    };
  }

  if (!isSubDomain) {
    const match = matchPath(
      { path: "/festivals/:festivalSlug/editions/:editionSlug" },
      location.pathname,
    );

    return {
      festivalSlug: match?.params.festivalSlug,
      editionSlug: match?.params.editionSlug,
    };
  }

  const match = matchPath(
    { path: "/editions/:editionSlug" },
    location.pathname,
  );

  return {
    festivalSlug: propFestivalSlug,
    editionSlug: match?.params.editionSlug,
  };
}

export function FestivalEditionProvider({
  children,
  festivalSlug: propFestivalSlug,
  isSubDomain,
}: PropsWithChildren<{ festivalSlug?: string; isSubDomain?: boolean }>) {
  const navigate = useNavigate();

  const { festivalSlug, editionSlug } = getSlugs({
    propFestivalSlug,
    isSubDomain,
  });

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
