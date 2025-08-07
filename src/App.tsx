import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CookieConsentBanner } from "@/components/legal/CookieConsentBanner";
import { AppFooter } from "@/components/legal/AppFooter";
import Index from "./pages/Index";
import ArtistDetail from "./pages/ArtistDetail";
import Groups from "./pages/Groups";
import GroupDetail from "./pages/GroupDetail";
import Schedule from "./pages/Schedule";
import AdminLayout from "./pages/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminAnalytics from "./pages/admin/AdminAnalytics";
import AdminRoles from "./pages/admin/AdminRoles";
import AdminFestivals from "./pages/admin/AdminFestivals";
import FestivalDetail from "./pages/admin/FestivalDetail";
import FestivalEdition from "./pages/admin/FestivalEdition";
import FestivalStages from "./pages/admin/FestivalStages";
import FestivalSets from "./pages/admin/FestivalSets";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import CookiePolicy from "./pages/CookiePolicy";
import NotFound from "./pages/NotFound";
import { SetDetails } from "./pages/SetDetails";

const App = () => (
  <TooltipProvider>
    <Toaster />
    <Sonner />
    <CookieConsentBanner />
    <BrowserRouter>
      <div className="min-h-screen flex flex-col">
        <div className="flex-1">
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/set/:id" element={<SetDetails />} />
            <Route path="/artist/:id" element={<ArtistDetail />} />
            <Route path="/groups" element={<Groups />} />
            <Route path="/groups/:groupId" element={<GroupDetail />} />
            <Route path="/schedule" element={<Schedule />} />
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
