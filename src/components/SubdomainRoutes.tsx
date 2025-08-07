import { Routes, Route } from "react-router-dom";
import { FestivalEditionProvider } from "@/contexts/FestivalEditionContext";
import EditionView from "@/pages/EditionView";
import Schedule from "@/pages/Schedule";
import { SetDetails } from "@/pages/SetDetails";
import Groups from "@/pages/Groups";
import GroupDetail from "@/pages/GroupDetail";

// Legal pages
import PrivacyPolicy from "@/pages/PrivacyPolicy";
import TermsOfService from "@/pages/TermsOfService";
import CookiePolicy from "@/pages/CookiePolicy";
import NotFound from "@/pages/NotFound";
import EditionSelection from "@/pages/EditionSelection";

/**
 * Routes for subdomain access (boom-festival.getupline.com)
 * Root path shows edition selection for the festival
 */
export function SubdomainRoutes({ festivalSlug }: { festivalSlug?: string }) {
  return (
    <FestivalEditionProvider festivalSlug={festivalSlug} isSubDomain>
      <Routes>
        <Route path="/" element={<EditionSelection />} />
        {/* Edition-specific routes */}
        <Route path="/editions/:editionSlug" element={<EditionView />} />
        <Route
          path="/editions/:editionSlug/sets/:setId"
          element={<SetDetails />}
        />
        <Route path="/editions/:editionSlug/schedule" element={<Schedule />} />

        {/* Global routes still available */}
        <Route path="/groups" element={<Groups />} />
        <Route path="/groups/:groupId" element={<GroupDetail />} />

        {/* Legal pages */}
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/terms" element={<TermsOfService />} />
        <Route path="/cookies" element={<CookiePolicy />} />

        {/* Catch-all */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </FestivalEditionProvider>
  );
}
