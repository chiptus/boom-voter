import { cn } from "@/lib/utils";
import { Calendar, List, Map, Info, MessageSquare } from "lucide-react";
import { NavLink, useParams } from "react-router-dom";

export type MainTab = "artists" | "timeline" | "map" | "info" | "social";

const TAB_CONFIG = {
  artists: {
    icon: List,
    label: "Vote",
    shortLabel: "Vote",
    disabled: false,
  },
  timeline: {
    icon: Calendar,
    label: "Schedule",
    shortLabel: "Schedule",
    disabled: false,
  },
  map: {
    icon: Map,
    label: "Map",
    shortLabel: "Map",
    disabled: true,
  },
  info: {
    icon: Info,
    label: "Info",
    shortLabel: "Info",
    disabled: true,
  },
  social: {
    icon: MessageSquare,
    label: "Social",
    shortLabel: "Social",
    disabled: true,
  },
} as const;

export function MainTabNavigation() {
  const { editionSlug, festivalSlug } = useParams();

  // Build base path depending on whether we're on main domain or subdomain
  function getBasePath(): string {
    if (festivalSlug && editionSlug) {
      // Main domain: /festivals/boom/editions/2024
      return `/festivals/${festivalSlug}/editions/${editionSlug}`;
    } else if (editionSlug) {
      // Subdomain: /editions/2024
      return `/editions/${editionSlug}`;
    }
    return "";
  }

  const basePath = getBasePath();

  return (
    <>
      {/* Desktop: Horizontal tabs at top */}
      <div className="hidden md:block mb-6">
        <div className="bg-white/10 backdrop-blur-md rounded-lg p-2">
          <div className="flex gap-1 justify-center">
            {Object.entries(TAB_CONFIG).map(([tabKey, config]) => {
              const tab = tabKey as MainTab;
              const to = tab === "artists" ? basePath : `${basePath}/${tab}`;

              return (
                <NavLink
                  key={tab}
                  to={to}
                  end={tab === "artists"} // Only match exact path for artists tab
                  className={({ isActive }) =>
                    cn(
                      `
                    flex items-center justify-center gap-2
                    px-6 py-3 rounded-lg
                    transition-all duration-200 active:scale-95`,
                      isActive
                        ? "bg-purple-600 text-white shadow-lg"
                        : "text-purple-200 hover:text-white hover:bg-white/10",
                      config.disabled ? "cursor-not-allowed opacity-50" : "",
                    )
                  }
                >
                  <config.icon className="h-5 w-5" />
                  <span className="font-medium">{config.label}</span>
                </NavLink>
              );
            })}
          </div>
        </div>
      </div>

      {/* Mobile: Fixed bottom navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-gray-900/95 backdrop-blur-md border-t border-purple-400/20 safe-area-pb">
        <div className="flex">
          {Object.entries(TAB_CONFIG).map(([tabKey, config]) => {
            const tab = tabKey as MainTab;
            const to = tab === "artists" ? basePath : `${basePath}/${tab}`;

            return (
              <NavLink
                key={tab}
                to={to}
                end={tab === "artists"} // Only match exact path for artists tab
                className={({ isActive }) => `
                  flex-1 flex flex-col items-center justify-center
                  py-2 px-1 transition-colors duration-200 min-h-16
                  ${
                    isActive
                      ? "text-purple-400"
                      : "text-gray-400 active:text-purple-300"
                  }
                  ${config.disabled ? "cursor-not-allowed opacity-50" : ""}
                `}
              >
                {({ isActive }) => (
                  <>
                    <config.icon
                      className={`h-6 w-6 mb-1 ${isActive ? "text-purple-400" : "text-gray-400"}`}
                    />
                    <span
                      className={`text-xs font-medium text-center leading-tight ${isActive ? "text-purple-400" : "text-gray-400"}`}
                    >
                      {config.shortLabel}
                    </span>
                  </>
                )}
              </NavLink>
            );
          })}
        </div>
      </div>
    </>
  );
}
