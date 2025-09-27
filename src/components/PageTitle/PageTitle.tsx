import { Helmet } from "react-helmet-async";

const DEFAULT_TITLE = "UpLine";
const TITLE_SEPARATOR = " - ";

/**
 * Component to set the page title and meta tags using Helmet
 */
interface PageTitleProps {
  title?: string;
  prefix?: string;
  description?: string;
}

export function PageTitle({ title, prefix, description }: PageTitleProps) {
  const fullTitle = buildTitle(title, prefix);
  return (
    <Helmet>
      <title>{fullTitle}</title>
      {description && <meta name="description" content={description} />}
      <meta property="og:title" content={fullTitle} />
      {description && <meta property="og:description" content={description} />}
      <meta name="twitter:title" content={fullTitle} />
      {description && <meta name="twitter:description" content={description} />}
    </Helmet>
  );
}

/**
 * Get environment prefix based on current hostname
 */
function getEnvironmentPrefix(): string | undefined {
  if (typeof window === "undefined") return undefined;

  const hostname = window.location.hostname;

  if (hostname === "localhost" || hostname === "127.0.0.1") {
    return "LOCAL";
  }

  if (!hostname.includes("getupline.com")) {
    return "DEV";
  }

  return undefined;
}

/**
 * Utility function to build title from parts
 */
function buildTitle(title?: string, prefix?: string): string {
  const parts = [DEFAULT_TITLE];

  if (title) {
    parts.unshift(title);
  }

  if (prefix) {
    parts.unshift(prefix);
  }

  const envPrefix = getEnvironmentPrefix();
  if (envPrefix) {
    parts.unshift(envPrefix);
  }

  return parts.join(TITLE_SEPARATOR);
}
