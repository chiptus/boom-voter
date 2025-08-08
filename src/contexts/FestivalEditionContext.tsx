import { createContext, PropsWithChildren, useContext, useMemo } from "react";
import { matchPath } from "react-router-dom";
import { type Festival, type FestivalEdition } from "@/services/queries";
import {
  useFestivalEditionBySlugQuery,
  useFestivalBySlugQuery,
} from "@/hooks/queries/useFestivalQuery";

interface FestivalEditionContextType {
  // Current state
  festival: Festival | null;
  edition: FestivalEdition | null;

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

function getSlugs(pathname: string) {
  let festivalSlug = "";
  if (pathname.includes("/festivals/")) {
    const match = matchPath({ path: "/festivals/:festivalSlug/*" }, pathname);

    festivalSlug = match?.params.festivalSlug || "";

    pathname = pathname.replace(`/festivals/${festivalSlug}`, "");
  }

  if (!location.pathname.includes("/editions")) {
    return {
      festivalSlug,
    };
  }

  const match = matchPath({ path: "/editions/:editionSlug/*" }, pathname);

  const editionSlug = match?.params.editionSlug || "";

  return {
    festivalSlug,
    editionSlug,
  };
}

export function FestivalEditionProvider({
  children,
}: PropsWithChildren<unknown>) {
  const pathname = location.pathname;
  const { festivalSlug, editionSlug } = useMemo(
    () => getSlugs(pathname),
    [pathname],
  );

  const festivalQuery = useFestivalBySlugQuery(festivalSlug);

  const editionQuery = useFestivalEditionBySlugQuery({
    festivalSlug,
    editionSlug,
  });

  const festival = festivalQuery.data;
  const edition = editionQuery.data;

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
    isContextReady,
  };

  return (
    <FestivalEditionContext.Provider value={contextValue}>
      {children}
    </FestivalEditionContext.Provider>
  );
}
