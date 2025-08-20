import { Routes, Route } from "react-router-dom";

import { SubdomainRedirect } from "./SubdomainRedirect";
import FestivalSelection from "@/pages/FestivalSelection";
import EditionSelection from "@/pages/EditionSelection";
import { SetDetails } from "@/pages/SetDetails";
import EditionView from "@/pages/EditionView";
import Schedule from "@/pages/Schedule";
import { GlobalRoutes } from "./GlobalRoutes";

/**
 * Routes for main domain access (getupline.com)
 * Includes festival selection and full admin interface
 */
export function MainDomainRoutes() {
  return (
    <>
      <Routes>
        {/* Festival/Edition Selection Routes */}
        <Route path="/" element={<FestivalSelection />} />
        {/* Festival routes redirect to subdomains */}
        <Route
          path="/festivals/:festivalSlug"
          element={<SubdomainRedirect component={EditionSelection} />}
        />
        <Route
          path="/festivals/:festivalSlug/editions/:editionSlug"
          element={<SubdomainRedirect component={EditionView} />}
        />
        <Route
          path="/festivals/:festivalSlug/editions/:editionSlug/sets/:setSlug"
          element={<SubdomainRedirect component={SetDetails} />}
        />
        <Route
          path="/festivals/:festivalSlug/editions/:editionSlug/schedule"
          element={<SubdomainRedirect component={Schedule} />}
        />

        <Route path="*" element={<GlobalRoutes />} />
      </Routes>
    </>
  );
}
