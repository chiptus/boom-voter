import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BrowserRouter } from "react-router-dom";
import { CookieConsentBanner } from "@/components/legal/CookieConsentBanner";
import { AppFooter } from "@/components/legal/AppFooter";
import { getSubdomainInfo } from "@/lib/subdomain";

import { MainDomainRoutes } from "./components/MainDomainRoutes";
import { SubdomainRoutes } from "./components/SubdomainRoutes";
import { useState } from "react";

const App = () => {
  const [subdomainInfo] = useState(() => getSubdomainInfo());

  return (
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <CookieConsentBanner />
      <BrowserRouter>
        <div className="min-h-screen flex flex-col">
          <div className="flex-1">
            {subdomainInfo.isSubdomain && subdomainInfo.festivalSlug ? (
              // Subdomain routing: boom-festival.getupline.com
              <SubdomainRoutes festivalSlug={subdomainInfo.festivalSlug} />
            ) : (
              // Main domain routing: getupline.com
              <MainDomainRoutes />
            )}
          </div>
          <AppFooter />
        </div>
      </BrowserRouter>
    </TooltipProvider>
  );
};

export default App;
