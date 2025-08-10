/**
 * Utility functions for handling festival routing via subdomains or URL paths
 *
 * This app supports two routing modes:
 * 1. Subdomain-based: boom-festival.getupline.com (production)
 * 2. Path-based: localhost:8080/festivals/boom-festival (development)
 */

// Information about the current domain and festival
export interface SubdomainInfo {
  festivalSlug: string | null; // The festival identifier (e.g., "boom-festival")
  isSubdomain: boolean; // True if using subdomain routing
  isMainDomain: boolean; // True if on main domain (not festival-specific)
}

// Check if we're on the production domain (getupline.com)
export function isMainGetuplineDomain(): boolean {
  if (typeof window === "undefined") return false;
  return window.location.hostname === "getupline.com";
}

// Check if we need to redirect from www to non-www
export function shouldRedirectFromWww(): boolean {
  if (typeof window === "undefined") return false;
  return window.location.hostname === "www.getupline.com";
}

// Build redirect URL without www prefix
export function getNonWwwRedirectUrl(): string {
  if (typeof window === "undefined") return "";
  const { protocol, pathname, search, hash } = window.location;
  return `${protocol}//getupline.com${pathname}${search}${hash}`;
}

/**
 * Extract festival information from the current URL
 *
 * Handles both routing modes:
 * - Subdomain: boom-festival.getupline.com → "boom-festival"
 * - Path-based: localhost:8080/festivals/boom-festival → "boom-festival"
 */
export function getSubdomainInfo(): SubdomainInfo {
  // Default response for server-side rendering
  if (typeof window === "undefined") {
    return { festivalSlug: null, isSubdomain: false, isMainDomain: true };
  }

  const hostname = window.location.hostname;
  const isProductionDomain = hostname.endsWith("getupline.com");

  // Development/localhost: check for path-based routing (/festivals/slug)
  if (!isProductionDomain) {
    const pathMatch = window.location.pathname.match(/^\/festivals\/([^/]+)/);

    return {
      festivalSlug: pathMatch ? pathMatch[1] : null,
      isSubdomain: false,
      isMainDomain: !pathMatch, // false if we found a festival path
    };
  }

  // Production domain: check for subdomain routing
  const domainParts = hostname.split(".");

  // Need at least 3 parts for subdomain: [subdomain, domain, tld]
  if (domainParts.length >= 3) {
    const subdomain = domainParts[0];

    // Skip www subdomain (treat as main domain)
    if (subdomain === "www") {
      return { festivalSlug: null, isSubdomain: false, isMainDomain: true };
    }

    // Valid festival subdomain found
    return {
      festivalSlug: subdomain,
      isSubdomain: true,
      isMainDomain: false,
    };
  }

  // Main domain with no subdomain
  return { festivalSlug: null, isSubdomain: false, isMainDomain: true };
}

// Get current hostname (for URL building)
function getCurrentDomain(): string {
  if (typeof window === "undefined") return "";
  return window.location.hostname;
}

// Get current protocol (http: or https:)
function getCurrentProtocol(): string {
  if (typeof window === "undefined") return "https:";
  return window.location.protocol;
}

/**
 * Build URL for a specific festival
 *
 * Production: Creates subdomain URL (boom-festival.getupline.com/path)
 * Development: Creates path-based URL (localhost:8080/festivals/boom-festival/path)
 */
export function createFestivalSubdomainUrl(
  festivalSlug: string,
  path: string = "/",
): string {
  const protocol = getCurrentProtocol();
  const domain = getCurrentDomain();

  // Production: use subdomain routing
  if (isMainGetuplineDomain()) {
    return `${protocol}//${festivalSlug}.${domain}${path}`;
  }

  // Development: use path-based routing
  const festivalPath = path === "/" ? "" : path;
  return `${protocol}//${domain}/festivals/${festivalSlug}${festivalPath}`;
}

/**
 * Build URL for the main domain homepage
 */
export function createMainDomainUrl(path: string = "/"): string {
  const protocol = getCurrentProtocol();
  const domain = getCurrentDomain();
  return `${protocol}//${domain}${path}`;
}
