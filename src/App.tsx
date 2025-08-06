
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
import Admin from "./pages/Admin";
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
            <Route path="/admin" element={<Admin />} />
            <Route path="/admin/:tab" element={<Admin />} />
            <Route path="/admin/festivals/:festivalId/:subtab" element={<Admin />} />
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
