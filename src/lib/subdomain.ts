/**
 * Utility functions for handling subdomain-based festival routing
 */

export interface SubdomainInfo {
  festivalSlug: string | null;
  isSubdomain: boolean;
  isMainDomain: boolean;
}

/**
 * Extract festival slug from subdomain
 * Examples:
 * - boom-festival.getupline.com -> "boom-festival"
 * - getupline.com -> null
 * - www.getupline.com -> null
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

  // Handle localhost development
  if (hostname === "localhost" || hostname.includes("127.0.0.1")) {
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
 * Get the main domain without subdomain
 */
export function getMainDomain(): string {
  if (typeof window === "undefined") return "";

  const hostname = window.location.hostname;

  // Handle localhost
  if (hostname === "localhost" || hostname.includes("127.0.0.1")) {
    return hostname;
  }

  const parts = hostname.split(".");

  // If already main domain (2 parts: domain.tld)
  if (parts.length <= 2) {
    return hostname;
  }

  // If www subdomain, remove it and return domain.tld
  if (parts[0] === "www") {
    return parts.slice(1).join(".");
  }

  // For other subdomains, return domain.tld (remove subdomain)
  return parts.slice(1).join(".");
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

  // Handle localhost development
  if (mainDomain.includes("localhost") || mainDomain.includes("127.0.0.1")) {
    return `${protocol}//${mainDomain}/festivals/${festivalSlug}${path === "/" ? "" : path}`;
  }

  return `${protocol}//${festivalSlug}.${mainDomain}${path}`;
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
