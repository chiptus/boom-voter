import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { createFestivalSubdomainUrl } from "@/lib/subdomain";
import { FestivalEditionProvider } from "@/contexts/FestivalEditionContext";
import EditionSelection from "@/pages/EditionSelection";
import EditionView from "@/pages/EditionView";
import Schedule from "@/pages/Schedule";
import { SetDetails } from "@/pages/SetDetails";

/**
 * Component that redirects main domain festival URLs to subdomains
 * Used for: /festivals/boom-festival -> boom-festival.getupline.com
 * For localhost development, renders the appropriate component directly
 */
export function SubdomainRedirect() {
  const { festivalSlug, editionSlug, setId } = useParams<{
    festivalSlug?: string;
    editionSlug?: string;
    setId?: string;
  }>();

  const isLocalhost =
    window.location.hostname.includes("localhost") ||
    window.location.hostname.includes("127.0.0.1");

  useEffect(() => {
    if (!festivalSlug || isLocalhost) return;

    // Build the target path based on current route
    let targetPath = "/";

    if (editionSlug && setId) {
      targetPath = `/editions/${editionSlug}/sets/${setId}`;
    } else if (editionSlug && window.location.pathname.includes("schedule")) {
      targetPath = `/editions/${editionSlug}/schedule`;
    } else if (editionSlug) {
      targetPath = `/editions/${editionSlug}`;
    }

    // Redirect to subdomain
    const subdomainUrl = createFestivalSubdomainUrl(festivalSlug, targetPath);
    window.location.href = subdomainUrl;
  }, [festivalSlug, editionSlug, setId, isLocalhost]);

  // For localhost development, render the appropriate component directly
  if (isLocalhost && festivalSlug) {
    return (
      <FestivalEditionProvider festivalSlug={festivalSlug}>
        {setId ? (
          <SetDetails />
        ) : editionSlug && window.location.pathname.includes("schedule") ? (
          <Schedule />
        ) : editionSlug ? (
          <EditionView />
        ) : (
          <EditionSelection />
        )}
      </FestivalEditionProvider>
    );
  }

  // Show loading message while redirecting (production only)
  return (
    <div className="min-h-screen bg-app-gradient flex items-center justify-center">
      <div className="text-center">
        <div className="text-white text-xl mb-4">Redirecting...</div>
        <div className="text-purple-200">
          Taking you to{" "}
          {festivalSlug ? `${festivalSlug}.getupline.com` : "the festival site"}
        </div>
      </div>
    </div>
  );
}
