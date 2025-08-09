/**
 * Utility functions for handling subdomain-based festival routing
 */

export interface SubdomainInfo {
  festivalSlug: string | null;
  isSubdomain: boolean;
  isMainDomain: boolean;
}

/**
 * Check if the current hostname is the main getupline.com domain
 */
function isMainGetuplineDomain(): boolean {
  if (typeof window === "undefined") return false;
  return window.location.hostname === "getupline.com";
}

/**
 * Check if we should redirect www.getupline.com to getupline.com
 */
export function shouldRedirectFromWww(): boolean {
  if (typeof window === "undefined") return false;
  return window.location.hostname === "www.getupline.com";
}

/**
 * Get the non-www redirect URL
 */
export function getNonWwwRedirectUrl(): string {
  if (typeof window === "undefined") return "";
  const protocol = window.location.protocol;
  const pathname = window.location.pathname;
  const search = window.location.search;
  const hash = window.location.hash;
  return `${protocol}//getupline.com${pathname}${search}${hash}`;
}

export function shouldRedirectToSubdomain() {
  // Only use subdomain redirects for main getupline.com domain
  return isMainGetuplineDomain();
}

/**
 * Extract festival slug from subdomain or URL path
 * Examples:
 * - boom-festival.getupline.com -> "boom-festival"
 * - getupline.com -> null
 * - www.getupline.com -> null
 * - localhost:8080/festivals/boom-festival -> "boom-festival" (path-based routing)
 * - 192.168.1.1:8080/festivals/boom-festival -> "boom-festival" (path-based routing)
 */
export function getSubdomainInfo(): SubdomainInfo {
  // Default for SSR/build time
  if (typeof window === "undefined") {
    return {
      festivalSlug: null,
      isSubdomain: false,
      isMainDomain: true,
    };
  }

  const hostname = window.location.hostname;
  const parts = hostname.split(".");
  const shouldRedirect = shouldRedirectToSubdomain();

  // Handle non-main domains (localhost, IP, development domains) - use path-based routing
  if (!shouldRedirect) {
    const pathname = window.location.pathname;
    const pathMatch = pathname.match(/^\/festivals\/([^/]+)/);

    if (pathMatch) {
      // Path-based festival routing (localhost/IP addresses/development domains)
      return {
        festivalSlug: pathMatch[1],
        isSubdomain: false, // It's not a real subdomain, but path-based
        isMainDomain: true, // It's festival-specific content
      };
    }

    return {
      festivalSlug: null,
      isSubdomain: false,
      isMainDomain: true,
    };
  }

  // Check if it's a subdomain (at least 3 parts: subdomain.domain.tld)
  if (parts.length >= 3) {
    const subdomain = parts[0];

    // Ignore www subdomain
    if (subdomain === "www") {
      return {
        festivalSlug: null,
        isSubdomain: false,
        isMainDomain: true,
      };
    }

    // Only getupline.com is a main domain that supports subdomains
    if (isMainGetuplineDomain()) {
      return {
        festivalSlug: null,
        isSubdomain: false,
        isMainDomain: true,
      };
    }

    const result = {
      festivalSlug: subdomain,
      isSubdomain: true,
      isMainDomain: false,
    };

    return result;
  }

  // Main domain (domain.tld)
  const result = {
    festivalSlug: null,
    isSubdomain: false,
    isMainDomain: true,
  };

  return result;
}

/**
 * Get the main domain (always returns current hostname)
 */
export function getMainDomain(): string {
  if (typeof window === "undefined") return "";
  return window.location.hostname;
}

/**
 * Create URL for a festival subdomain
 */
export function createFestivalSubdomainUrl(
  festivalSlug: string,
  path: string = "/",
): string {
  const protocol =
    typeof window !== "undefined" ? window.location.protocol : "https:";
  const mainDomain = getMainDomain();

  // Only use subdomain routing for main getupline.com domain
  if (isMainGetuplineDomain()) {
    return `${protocol}//${festivalSlug}.${mainDomain}${path}`;
  }

  // For all other domains (localhost, IP, development), use path-based routing
  return `${protocol}//${mainDomain}/festivals/${festivalSlug}${path === "/" ? "" : path}`;
}

/**
 * Create URL for main domain
 */
export function createMainDomainUrl(path: string = "/"): string {
  const protocol =
    typeof window !== "undefined" ? window.location.protocol : "https:";
  const mainDomain = getMainDomain();

  return `${protocol}//${mainDomain}${path}`;
}
