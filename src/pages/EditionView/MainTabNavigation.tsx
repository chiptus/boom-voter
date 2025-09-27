import { cn } from "@/lib/utils";
import { Calendar, List, Info, MessageSquare } from "lucide-react";
import { NavLink } from "react-router-dom";
import { useFestivalEdition } from "@/contexts/FestivalEditionContext";

export type MainTab = "sets" | "schedule" | "map" | "info" | "social";

const TAB_CONFIG = {
  sets: {
    icon: List,
    label: "Vote",
    shortLabel: "Vote",
    disabled: false,
  },
  schedule: {
    icon: Calendar,
    label: "Schedule",
    shortLabel: "Schedule",
    disabled: false,
  },
  // map: {
  //   icon: Map,
  //   label: "Map",
  //   shortLabel: "Map",
  //   disabled: false,
  // },
  info: {
    icon: Info,
    label: "Info",
    shortLabel: "Info",
    disabled: false,
  },
  social: {
    icon: MessageSquare,
    label: "Social",
    shortLabel: "Social",
    disabled: false,
  },
} as const;

export function MainTabNavigation() {
  const { basePath } = useFestivalEdition();

  return (
    <>
      {/* Desktop: Horizontal tabs at top */}
      <div className="hidden md:block mb-6">
        <div className="bg-white/10 backdrop-blur-md rounded-lg p-2">
          <div className="flex gap-1 justify-center">
            {Object.entries(TAB_CONFIG).map(([tabKey, config]) => {
              const tab = tabKey as MainTab;

              return (
                <NavLink
                  key={tab}
                  to={`${basePath}/${tab}`}
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

            return (
              <NavLink
                key={tab}
                to={`${basePath}/${tab}`}
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
