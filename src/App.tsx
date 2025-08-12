import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BrowserRouter } from "react-router-dom";
import { CookieConsentBanner } from "@/components/legal/CookieConsentBanner";
import {
  getSubdomainInfo,
  shouldRedirectFromWww,
  getNonWwwRedirectUrl,
} from "@/lib/subdomain";
import { AuthProvider } from "@/contexts/AuthContext";
import { useState, useEffect } from "react";
import { FestivalEditionProvider } from "./contexts/FestivalEditionContext";
import { AppRoutes } from "./components/AppRoutes";

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
            <AppRoutes subdomainInfo={subdomainInfo} />
          </FestivalEditionProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  );
}

export default App;
