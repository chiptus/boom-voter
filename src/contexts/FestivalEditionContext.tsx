import { createContext, PropsWithChildren, useContext, useMemo } from "react";
import { matchPath, useLocation } from "react-router-dom";
import { type Festival, type FestivalEdition } from "@/services/queries";
import {
  useFestivalEditionBySlugQuery,
  useFestivalBySlugQuery,
} from "@/hooks/queries/useFestivalQuery";
import { getSubdomainInfo } from "@/lib/subdomain";

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

export function useFestivalEdition() {
  const context = useContext(FestivalEditionContext);
  if (context === undefined) {
    throw new Error(
      "useFestivalEdition must be used within a FestivalEditionProvider",
    );
  }
  return context;
}

function getSlugs(pathname: string) {
  // Get festival slug from subdomain or URL path
  const subdomainInfo = getSubdomainInfo();
  let festivalSlug = subdomainInfo.festivalSlug || "";

  console.log("🔍 FestivalEditionContext getSlugs debug:", {
    pathname,
    subdomainInfo,
    festivalSlug: subdomainInfo.festivalSlug,
    isSubdomain: subdomainInfo.isSubdomain,
    isMainDomain: subdomainInfo.isMainDomain,
  });

  // For main domain, extract festival slug from URL path
  if (!festivalSlug && pathname.includes("/festivals/")) {
    const match = matchPath({ path: "/festivals/:festivalSlug/*" }, pathname);
    festivalSlug = match?.params.festivalSlug || "";
    pathname = pathname.replace(`/festivals/${festivalSlug}`, "");
  }

  if (!pathname.includes("/editions")) {
    console.log("🔍 No editions in pathname, returning:", { festivalSlug });
    return {
      festivalSlug,
    };
  }

  const match = matchPath({ path: "/editions/:editionSlug/*" }, pathname);
  const editionSlug = match?.params.editionSlug || "";

  console.log("🔍 Found editions in pathname, returning:", {
    festivalSlug,
    editionSlug,
  });
  return {
    festivalSlug,
    editionSlug,
  };
}

function useParseSlugs() {
  const location = useLocation();
  const pathname = location.pathname;

  return useMemo(() => getSlugs(pathname), [pathname]);
}

export function FestivalEditionProvider({
  children,
}: PropsWithChildren<unknown>) {
  const { festivalSlug, editionSlug } = useParseSlugs();

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
