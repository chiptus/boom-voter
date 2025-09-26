import { Helmet } from "react-helmet-async";

const DEFAULT_TITLE = "UpLine";
const TITLE_SEPARATOR = " - ";

/**
 * Utility function to build title from parts
 */
export function buildTitle(title?: string, prefix?: string): string {
  const parts = [DEFAULT_TITLE];

  if (title) {
    parts.unshift(title);
  }

  if (prefix) {
    parts.unshift(prefix);
  }

  return parts.join(TITLE_SEPARATOR);
}

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
