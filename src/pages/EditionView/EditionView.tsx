import { AppHeader } from "@/components/layout/AppHeader";
import { MainTabNavigation } from "./MainTabNavigation";
import ErrorBoundary from "@/components/ErrorBoundary";
import { useFestivalEdition } from "@/contexts/FestivalEditionContext";
import { Outlet } from "react-router-dom";

export default function EditionView() {
  // Get festival/edition context
  const { festival, edition, isContextReady } = useFestivalEdition();

  // Show loading while context is not ready
  if (!isContextReady) {
    return (
      <div className="min-h-screen bg-app-gradient flex items-center justify-center">
        <div className="text-white text-xl">Loading festival...</div>
      </div>
    );
  }

  if (!festival || !edition) {
    return (
      <div className="min-h-screen bg-app-gradient flex items-center justify-center">
        <div className="text-white text-xl">Loading festival...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-app-gradient">
      <div className="container mx-auto px-4 py-4 md:py-8 pb-20 md:pb-8">
        <AppHeader
          title={festival.name}
          // subtitle={edition.name}
          // description="Festival voting platform"
          logoUrl={festival.logo_url}
          showGroupsButton
        />

        {/* Main Tab Navigation */}
        <MainTabNavigation />

        <div className="mt-4 md:mt-8">
          <ErrorBoundary>
            <Outlet />
          </ErrorBoundary>
        </div>
      </div>
    </div>
  );
}
