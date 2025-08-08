import { useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  createFestivalSubdomainUrl,
  shouldRedirectToSubdomain,
} from "@/lib/subdomain";

interface SubdomainRedirectProps {
  component: React.ComponentType;
}
/**
 * Component that redirects main domain festival URLs to subdomains
 * Used for: /festivals/boom-festival -> boom-festival.getupline.com
 * For localhost development, renders the appropriate component directly
 */
export function SubdomainRedirect({
  component: Component,
}: SubdomainRedirectProps) {
  const { festivalSlug, editionSlug, setId } = useParams<{
    festivalSlug?: string;
    editionSlug?: string;
    setId?: string;
  }>();

  const shouldNotRedirect = !shouldRedirectToSubdomain();

  useEffect(() => {
    if (!festivalSlug || shouldNotRedirect) {
      return;
    }

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
  }, [festivalSlug, editionSlug, setId, shouldNotRedirect]);

  if (shouldNotRedirect) {
    return <Component />;
  }

  // Show loading message while redirecting (production only)
  return (
    <>
      <div className="min-h-screen bg-app-gradient flex items-center justify-center">
        <div className="text-center">
          <div className="text-white text-xl mb-4">Redirecting...</div>
          <div className="text-purple-200">
            Taking you to{" "}
            {festivalSlug
              ? `${festivalSlug}.getupline.com`
              : "the festival site"}
          </div>
        </div>
      </div>
      {/* <Navigate to={} /> */}
    </>
  );
}
