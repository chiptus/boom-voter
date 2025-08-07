import { Routes, Route } from "react-router-dom";
import { SubdomainRedirect } from "./SubdomainRedirect";

// Public pages
import FestivalSelection from "@/pages/FestivalSelection";
import Groups from "@/pages/Groups";
import GroupDetail from "@/pages/GroupDetail";

// Admin pages
import AdminLayout from "@/pages/AdminLayout";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import AdminAnalytics from "@/pages/admin/AdminAnalytics";
import AdminRoles from "@/pages/admin/AdminRoles";
import AdminFestivals from "@/pages/admin/AdminFestivals";
import FestivalDetail from "@/pages/admin/FestivalDetail";
import FestivalEdition from "@/pages/admin/FestivalEdition";
import FestivalStages from "@/pages/admin/FestivalStages";
import FestivalSets from "@/pages/admin/FestivalSets";

// Legal pages
import PrivacyPolicy from "@/pages/PrivacyPolicy";
import TermsOfService from "@/pages/TermsOfService";
import CookiePolicy from "@/pages/CookiePolicy";
import NotFound from "@/pages/NotFound";

/**
 * Routes for main domain access (getupline.com)
 * Includes festival selection and full admin interface
 */
export function MainDomainRoutes() {
  return (
    <Routes>
      {/* Festival/Edition Selection Routes */}
      <Route path="/" element={<FestivalSelection />} />

      {/* Festival routes redirect to subdomains */}
      <Route path="/festivals/:festivalSlug" element={<SubdomainRedirect />} />
      <Route
        path="/festivals/:festivalSlug/editions/:editionSlug"
        element={<SubdomainRedirect />}
      />
      <Route
        path="/festivals/:festivalSlug/editions/:editionSlug/sets/:setId"
        element={<SubdomainRedirect />}
      />
      <Route
        path="/festivals/:festivalSlug/editions/:editionSlug/schedule"
        element={<SubdomainRedirect />}
      />

      {/* Global routes (not scoped to festival/edition) */}
      <Route path="/groups" element={<Groups />} />
      <Route path="/groups/:groupId" element={<GroupDetail />} />

      {/* Admin routes */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<AdminDashboard />} />
        <Route path="artists" element={<AdminDashboard />} />
        <Route path="analytics" element={<AdminAnalytics />} />
        <Route path="admins" element={<AdminRoles />} />
        <Route path="festivals" element={<AdminFestivals />}>
          <Route path=":festivalId" element={<FestivalDetail />}>
            <Route path="editions/:editionId" element={<FestivalEdition />}>
              <Route index element={<FestivalStages />} />
              <Route path="stages" element={<FestivalStages />} />
              <Route path="sets" element={<FestivalSets />} />
            </Route>
          </Route>
        </Route>
      </Route>

      {/* Legal pages */}
      <Route path="/privacy" element={<PrivacyPolicy />} />
      <Route path="/terms" element={<TermsOfService />} />
      <Route path="/cookies" element={<CookiePolicy />} />

      {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
