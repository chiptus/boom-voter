import { Routes, Route } from "react-router-dom";
import EditionView from "@/pages/EditionView";
import Schedule from "@/pages/Schedule";
import { SetDetails } from "@/pages/SetDetails";

// Legal pages
import EditionSelection from "@/pages/EditionSelection";
import { GlobalRoutes } from "./GlobalRoutes";

/**
 * Routes for subdomain access (boom-festival.getupline.com)
 * Root path shows edition selection for the festival
 */
export function SubdomainRoutes() {
  return (
    <Routes>
      <Route path="/" element={<EditionSelection />} />
      {/* Edition-specific routes */}
      <Route path="/editions/:editionSlug" element={<EditionView />} />
      <Route
        path="/editions/:editionSlug/sets/:setSlug"
        element={<SetDetails />}
      />
      <Route path="/editions/:editionSlug/schedule" element={<Schedule />} />

      <Route path="*" element={<GlobalRoutes />} />
    </Routes>
  );
}
