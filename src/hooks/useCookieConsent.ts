import { useState, useEffect } from "react";
import { CrossDomainStorage } from "@/lib/crossDomainStorage";

const CONSENT_KEY = "gdpr-consent";
const CONSENT_VERSION = "1.0";

export interface ConsentPreferences {
  essential: boolean;
  analytics: boolean;
  preferences: boolean;
  marketing: boolean;
  version: string;
  timestamp: number;
}

const defaultConsent: ConsentPreferences = {
  essential: true, // Always true, required for app to function
  analytics: false,
  preferences: false,
  marketing: false,
  version: CONSENT_VERSION,
  timestamp: Date.now(),
};

export function useCookieConsent() {
  const [consent, setConsent] = useState<ConsentPreferences | null>(null);
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const savedConsent = CrossDomainStorage.getItem(CONSENT_KEY);
    if (savedConsent) {
      try {
        const parsed = JSON.parse(savedConsent);
        if (parsed.version === CONSENT_VERSION) {
          setConsent(parsed);
        } else {
          // Version mismatch, show banner again
          setShowBanner(true);
        }
      } catch {
        setShowBanner(true);
      }
    } else {
      setShowBanner(true);
    }
  }, []);

  function saveConsent(preferences: Partial<ConsentPreferences>) {
    const newConsent = {
      ...defaultConsent,
      ...preferences,
      timestamp: Date.now(),
    };

    setConsent(newConsent);
    CrossDomainStorage.setItem(CONSENT_KEY, JSON.stringify(newConsent));
    setShowBanner(false);
  }

  function acceptAll() {
    saveConsent({
      essential: true,
      analytics: true,
      preferences: true,
      marketing: true,
    });
  }

  function acceptEssential() {
    saveConsent({
      essential: true,
      analytics: false,
      preferences: false,
      marketing: false,
    });
  }

  function updateConsent(preferences: Partial<ConsentPreferences>) {
    if (consent) {
      saveConsent({ ...consent, ...preferences });
    }
  }

  function revokeConsent() {
    CrossDomainStorage.removeItem(CONSENT_KEY);
    setConsent(null);
    setShowBanner(true);

    // Clear non-essential cookies
    if (!consent?.preferences) {
      localStorage.removeItem("sidebar:state");
    }
  }

  function canUseCookie(type: keyof ConsentPreferences) {
    return consent?.[type] === true;
  }

  return {
    consent,
    showBanner,
    saveConsent,
    acceptAll,
    acceptEssential,
    updateConsent,
    revokeConsent,
    canUseCookie,
    setShowBanner,
  };
}
