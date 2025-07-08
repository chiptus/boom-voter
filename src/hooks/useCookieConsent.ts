import { useState, useEffect } from 'react';

const CONSENT_KEY = 'gdpr-consent';
const CONSENT_VERSION = '1.0';

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

export const useCookieConsent = () => {
  const [consent, setConsent] = useState<ConsentPreferences | null>(null);
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const savedConsent = localStorage.getItem(CONSENT_KEY);
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

  const saveConsent = (preferences: Partial<ConsentPreferences>) => {
    const newConsent = {
      ...defaultConsent,
      ...preferences,
      timestamp: Date.now(),
    };
    
    setConsent(newConsent);
    localStorage.setItem(CONSENT_KEY, JSON.stringify(newConsent));
    setShowBanner(false);
  };

  const acceptAll = () => {
    saveConsent({
      essential: true,
      analytics: true,
      preferences: true,
      marketing: true,
    });
  };

  const acceptEssential = () => {
    saveConsent({
      essential: true,
      analytics: false,
      preferences: false,
      marketing: false,
    });
  };

  const updateConsent = (preferences: Partial<ConsentPreferences>) => {
    if (consent) {
      saveConsent({ ...consent, ...preferences });
    }
  };

  const revokeConsent = () => {
    localStorage.removeItem(CONSENT_KEY);
    setConsent(null);
    setShowBanner(true);
    
    // Clear non-essential cookies
    if (!consent?.preferences) {
      localStorage.removeItem('sidebar:state');
    }
  };

  const canUseCookie = (type: keyof ConsentPreferences) => {
    return consent?.[type] === true;
  };

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
};