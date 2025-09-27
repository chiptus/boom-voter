import { useFestivalEdition } from "@/contexts/FestivalEditionContext";
import { useFestivalInfoQuery } from "@/hooks/queries/festival-info/useFestivalInfo";
import { DesktopTabButton } from "./DesktopTabButton";
import { MobileTabButton } from "./MobileTabButton";
import { config } from "./config";

export function MainTabNavigation() {
  const { basePath, festival } = useFestivalEdition();
  const { data: festivalInfo } = useFestivalInfoQuery(festival?.id);

  const visibleTabs = config.filter((config) => {
    if (typeof config.enabled === "boolean") {
      return config.enabled;
    }
    return config.enabled(festivalInfo);
  });

  return (
    <>
      {/* Desktop: Horizontal tabs at top */}
      <div className="hidden md:block mb-6">
        <div className="bg-white/10 backdrop-blur-md rounded-lg p-2">
          <div className="flex gap-1 justify-center">
            {visibleTabs.map((config) => (
              <DesktopTabButton
                key={config.key}
                config={config}
                basePath={basePath}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Mobile: Fixed bottom navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-gray-900/95 backdrop-blur-md border-t border-purple-400/20 safe-area-pb">
        <div className="flex">
          {visibleTabs.map((config) => (
            <MobileTabButton
              key={config.key}
              config={config}
              basePath={basePath}
            />
          ))}
        </div>
      </div>
    </>
  );
}
