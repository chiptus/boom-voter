import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CookieConsentBanner } from "@/components/legal/CookieConsentBanner";
import { AppFooter } from "@/components/legal/AppFooter";
import { FestivalEditionProvider } from "@/contexts/FestivalEditionContext";

// Public pages
import FestivalSelection from "./pages/FestivalSelection";
import EditionSelection from "./pages/EditionSelection";
import EditionView from "./pages/EditionView";
import Groups from "./pages/Groups";
import GroupDetail from "./pages/GroupDetail";
import Schedule from "./pages/Schedule";
import { SetDetails } from "./pages/SetDetails";

// Admin pages
import AdminLayout from "./pages/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminAnalytics from "./pages/admin/AdminAnalytics";
import AdminRoles from "./pages/admin/AdminRoles";
import AdminFestivals from "./pages/admin/AdminFestivals";
import FestivalDetail from "./pages/admin/FestivalDetail";
import FestivalEdition from "./pages/admin/FestivalEdition";
import FestivalStages from "./pages/admin/FestivalStages";
import FestivalSets from "./pages/admin/FestivalSets";

// Legal pages
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import CookiePolicy from "./pages/CookiePolicy";
import NotFound from "./pages/NotFound";

const App = () => (
  <TooltipProvider>
    <Toaster />
    <Sonner />
    <CookieConsentBanner />
    <BrowserRouter>
      <div className="min-h-screen flex flex-col">
        <div className="flex-1">
          <Routes>
            {/* Festival/Edition Selection Routes */}
            <Route path="/" element={<FestivalSelection />} />
            <Route
              path="/festivals/:festivalSlug"
              element={
                <FestivalEditionProvider>
                  <EditionSelection />
                </FestivalEditionProvider>
              }
            />
            <Route
              path="/festivals/:festivalSlug/editions/:editionSlug"
              element={
                <FestivalEditionProvider>
                  <EditionView />
                </FestivalEditionProvider>
              }
            />
            <Route
              path="/festivals/:festivalSlug/editions/:editionSlug/sets/:setId"
              element={
                <FestivalEditionProvider>
                  <SetDetails />
                </FestivalEditionProvider>
              }
            />
            <Route
              path="/festivals/:festivalSlug/editions/:editionSlug/schedule"
              element={
                <FestivalEditionProvider>
                  <Schedule />
                </FestivalEditionProvider>
              }
            />

            {/* Global routes (not scoped to festival/edition) */}
            <Route path="/groups" element={<Groups />} />
            <Route path="/groups/:groupId" element={<GroupDetail />} />

            {/* Admin routes (unchanged) */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="artists" element={<AdminDashboard />} />
              <Route path="analytics" element={<AdminAnalytics />} />
              <Route path="admins" element={<AdminRoles />} />
              <Route path="festivals" element={<AdminFestivals />}>
                <Route path=":festivalId" element={<FestivalDetail />}>
                  <Route
                    path="editions/:editionId"
                    element={<FestivalEdition />}
                  >
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
        </div>
        <AppFooter />
      </div>
    </BrowserRouter>
  </TooltipProvider>
);

export default App;
