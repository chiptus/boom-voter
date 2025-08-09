import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BrowserRouter } from "react-router-dom";
import { CookieConsentBanner } from "@/components/legal/CookieConsentBanner";
import { AppFooter } from "@/components/legal/AppFooter";
import {
  getSubdomainInfo,
  shouldRedirectFromWww,
  getNonWwwRedirectUrl,
} from "@/lib/subdomain";
import { AuthProvider } from "@/contexts/AuthContext";

import { MainDomainRoutes } from "./components/MainDomainRoutes";
import { SubdomainRoutes } from "./components/SubdomainRoutes";
import { useState, useEffect } from "react";
import { FestivalEditionProvider } from "./contexts/FestivalEditionContext";

function App() {
  const [subdomainInfo] = useState(() => getSubdomainInfo());

  // Redirect www.getupline.com to getupline.com
  useEffect(() => {
    if (shouldRedirectFromWww()) {
      window.location.href = getNonWwwRedirectUrl();
    }
  }, []);

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
                {subdomainInfo.festivalSlug && !subdomainInfo.isMainDomain ? (
                  // Festival-specific routing: subdomain or path-based
                  <SubdomainRoutes />
                ) : (
                  // Main domain routing: getupline.com or localhost without festival path
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
