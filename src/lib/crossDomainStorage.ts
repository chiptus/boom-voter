/**
 * Cross-domain storage utility for sharing data across subdomains
 * Uses cookies with domain=.getupline.com for production, localStorage for development
 */

interface CookieOptions {
  domain?: string;
  path?: string;
  maxAge?: number; // in seconds
  secure?: boolean;
  sameSite?: "strict" | "lax" | "none";
}

/**
 * Check if we're on a production domain that supports cross-subdomain cookies
 */
function isProductionDomain(): boolean {
  if (typeof window === "undefined") return false;
  return window.location.hostname.includes("getupline.com");
}

/**
 * Get the appropriate domain for cross-subdomain cookies
 */
function getCookieDomain(): string | undefined {
  if (!isProductionDomain()) return undefined;
  return ".getupline.com";
}

/**
 * Set a cookie with cross-domain support
 */
function setCookie(
  name: string,
  value: string,
  options: CookieOptions = {},
): void {
  if (typeof window === "undefined") return;

  const {
    domain = getCookieDomain(),
    path = "/",
    maxAge = 365 * 24 * 60 * 60, // 1 year default
    secure = window.location.protocol === "https:",
    sameSite = "lax",
  } = options;

  let cookieString = `${name}=${encodeURIComponent(value)}`;

  if (domain) cookieString += `; domain=${domain}`;
  cookieString += `; path=${path}`;
  cookieString += `; max-age=${maxAge}`;
  if (secure) cookieString += "; secure";
  cookieString += `; samesite=${sameSite}`;

  document.cookie = cookieString;
}

/**
 * Get a cookie value by name
 */
function getCookie(name: string): string | null {
  if (typeof window === "undefined") return null;

  const nameEQ = name + "=";
  const ca = document.cookie.split(";");

  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === " ") c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) {
      return decodeURIComponent(c.substring(nameEQ.length, c.length));
    }
  }
  return null;
}

/**
 * Remove a cookie
 */
function removeCookie(name: string): void {
  setCookie(name, "", { maxAge: -1 });
}

/**
 * Cross-domain storage that uses cookies for production and localStorage for development
 */
export const CrossDomainStorage = {
  /**
   * Store a value that will be accessible across subdomains
   */
  setItem: (key: string, value: string): void => {
    if (isProductionDomain()) {
      setCookie(key, value);
    } else {
      // Fallback to localStorage for development
      localStorage.setItem(key, value);
    }
  },

  /**
   * Retrieve a value, checking both cookies and localStorage
   */
  getItem: (key: string): string | null => {
    if (isProductionDomain()) {
      return getCookie(key);
    } else {
      // Fallback to localStorage for development
      return localStorage.getItem(key);
    }
  },

  /**
   * Remove a value from both cookies and localStorage
   */
  removeItem: (key: string): void => {
    if (isProductionDomain()) {
      removeCookie(key);
    }
    // Always try to remove from localStorage as well (for migration/cleanup)
    try {
      localStorage.removeItem(key);
    } catch {
      // Ignore errors if localStorage is not available
    }
  },

  /**
   * Check if cross-domain storage is supported
   */
  isSupported: (): boolean => {
    return (
      typeof window !== "undefined" &&
      (isProductionDomain() || typeof localStorage !== "undefined")
    );
  },
};

/**
 * Custom storage adapter for Supabase auth that supports cross-domain persistence
 */
export function createSupabaseStorage() {
  return {
    getItem: (key: string): string | null => {
      return CrossDomainStorage.getItem(key);
    },

    setItem: (key: string, value: string): void => {
      CrossDomainStorage.setItem(key, value);
    },

    removeItem: (key: string): void => {
      CrossDomainStorage.removeItem(key);
    },
  };
}
