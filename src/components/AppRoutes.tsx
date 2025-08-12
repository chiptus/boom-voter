import { useAuth } from "@/contexts/AuthContext";
import { useInviteValidation } from "@/components/Index/useInviteValidation";
import { InviteLandingPage } from "@/components/Index/InviteLandingPage";
import { MainDomainRoutes } from "./MainDomainRoutes";
import { SubdomainRoutes } from "./SubdomainRoutes";
import { AppFooter } from "@/components/legal/AppFooter";
import { useMemo } from "react";
import { useProfileQuery } from "@/hooks/queries/useProfileQuery";
import { UsernameSetupDialog } from "./Index/UsernameSetupDialog";

interface AppRoutesProps {
  subdomainInfo: {
    festivalSlug: string | null;
    isSubdomain: boolean;
    isMainDomain: boolean;
  };
}

export function AppRoutes({ subdomainInfo }: AppRoutesProps) {
  const { user, loading: authLoading, hasUsername } = useAuth();
  const { inviteValidation, isValidating, hasValidInvite } =
    useInviteValidation();

  // Get profile loading state to prevent dialog flashing
  const { isLoading: profileLoading } = useProfileQuery(user?.id);

  const showUsernameSetup = useMemo(() => {
    return !!user && !authLoading && !profileLoading && !hasUsername;
  }, [user, authLoading, profileLoading, hasUsername]);

  // Show loading while validating invite
  if (isValidating) {
    return (
      <div className="min-h-screen bg-app-gradient flex items-center justify-center">
        <div className="text-white text-xl">Validating invite...</div>
      </div>
    );
  }

  // Show invite landing page if there's a valid invite and user is not logged in
  if (hasValidInvite && !user && inviteValidation) {
    return (
      <InviteLandingPage
        inviteValidation={inviteValidation}
        onSignupSuccess={() => {
          // Invite processing is now handled in useAuth hook
        }}
      />
    );
  }

  // Show error page for invalid invites
  if (inviteValidation && !inviteValidation.is_valid) {
    return (
      <div className="min-h-screen bg-app-gradient flex items-center justify-center p-4">
        <div className="text-center text-white">
          <h1 className="text-2xl font-bold mb-4">Invalid Invite</h1>
          <p className="mb-4">This invite link is no longer valid.</p>
          <button
            onClick={() => (window.location.href = "/")}
            className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded"
          >
            Continue to App
          </button>
        </div>
      </div>
    );
  }

  // Normal routing flow
  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1">
        {subdomainInfo.festivalSlug && subdomainInfo.isSubdomain ? (
          // Festival-specific routing: subdomain or path-based
          <SubdomainRoutes />
        ) : (
          // Main domain routing: getupline.com or localhost without festival path
          <MainDomainRoutes />
        )}
      </div>
      <AppFooter />
      {user && <UsernameSetupDialog open={showUsernameSetup} user={user} />}
    </div>
  );
}
