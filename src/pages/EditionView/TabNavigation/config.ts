import {
  CalendarIcon,
  InfoIcon,
  ListIcon,
  MapIcon,
  MessageSquareIcon,
} from "lucide-react";
import { TabConfig } from "./types";

export const config: TabConfig[] = [
  {
    key: "sets",
    icon: ListIcon,
    label: "Vote",
    shortLabel: "Vote",
    enabled: true,
  },
  {
    key: "schedule",
    icon: CalendarIcon,
    label: "Schedule",
    shortLabel: "Schedule",
    enabled: true,
  },
  {
    key: "map",
    icon: MapIcon,
    label: "Map",
    shortLabel: "Map",
    enabled: (festivalInfo) => !!festivalInfo?.map_image_url,
  },
  {
    key: "info",
    icon: InfoIcon,
    label: "Info",
    shortLabel: "Info",
    enabled: (festivalInfo) => !!festivalInfo?.info_text,
  },
  {
    key: "social",
    icon: MessageSquareIcon,
    label: "Social",
    shortLabel: "Social",
    enabled: (festivalInfo) =>
      !!(festivalInfo?.facebook_url || festivalInfo?.instagram_url),
  },
];
