import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BrowserRouter } from "react-router-dom";
import { CookieConsentBanner } from "@/components/legal/CookieConsentBanner";
import { AppFooter } from "@/components/legal/AppFooter";
import { getSubdomainInfo } from "@/lib/subdomain";
import { AuthProvider } from "@/contexts/AuthContext";

import { MainDomainRoutes } from "./components/MainDomainRoutes";
import { SubdomainRoutes } from "./components/SubdomainRoutes";
import { useState } from "react";
import { FestivalEditionProvider } from "./contexts/FestivalEditionContext";

function App() {
  const [subdomainInfo] = useState(() => getSubdomainInfo());

  return (
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <CookieConsentBanner />
      <BrowserRouter
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true,
        }}
      >
        <AuthProvider>
          <FestivalEditionProvider>
            <div className="min-h-screen flex flex-col">
              <div className="flex-1">
                {subdomainInfo.isSubdomain && subdomainInfo.festivalSlug ? (
                  // Subdomain routing: boom-festival.getupline.com
                  <SubdomainRoutes />
                ) : (
                  // Main domain routing: getupline.com
                  <MainDomainRoutes />
                )}
              </div>
              <AppFooter />
            </div>
          </FestivalEditionProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  );
}

export default App;
