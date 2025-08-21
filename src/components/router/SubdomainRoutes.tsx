import { Routes, Route } from "react-router-dom";
import EditionSelection from "@/pages/EditionSelection";
import { GlobalRoutes } from "./GlobalRoutes";
import { createEditionRoutes } from "./EditionRoutes";

/**
 * Routes for subdomain access (boom-festival.getupline.com)
 * Root path shows edition selection for the festival
 */
export function SubdomainRoutes() {
  const editionRoutes = createEditionRoutes({
    basePath: "/editions/:editionSlug",
  });

  return (
    <Routes>
      <Route path="/" element={<EditionSelection />} />
      {/* Edition-specific routes */}
      {editionRoutes}

      <Route path="*" element={<GlobalRoutes />} />
    </Routes>
  );
}
