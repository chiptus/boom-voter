import { Route, Routes } from "react-router-dom";

import AdminAnalytics from "@/pages/admin/AdminAnalytics";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import AdminFestivals from "@/pages/admin/AdminFestivals";
import AdminRoles from "@/pages/admin/AdminRoles";
import FestivalDetail from "@/pages/admin/FestivalDetail";
import FestivalEdition from "@/pages/admin/FestivalEdition";
import FestivalSets from "@/pages/admin/FestivalSets";
import FestivalStages from "@/pages/admin/FestivalStages";
import AdminLayout from "@/pages/AdminLayout";
import CookiePolicy from "@/pages/CookiePolicy";
import GroupDetail from "@/pages/GroupDetail";
import Groups from "@/pages/Groups";
import PrivacyPolicy from "@/pages/PrivacyPolicy";
import TermsOfService from "@/pages/TermsOfService";
import NotFound from "@/pages/NotFound";

export function GlobalRoutes() {
  return (
    <Routes>
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

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
