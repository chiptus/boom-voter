import { Route } from "react-router-dom";
import EditionView from "@/pages/EditionView";
import { SetDetails } from "@/pages/SetDetails";
import Schedule from "@/pages/Schedule";

// Tab components
import { ArtistsTab } from "@/pages/tabs/ArtistsTab";
import { TimelineTab } from "@/pages/tabs/TimelineTab";
import { MapTab } from "@/pages/tabs/MapTab";
import { InfoTab } from "@/pages/tabs/InfoTab";
import { SocialTab } from "@/pages/tabs/SocialTab";

interface EditionRoutesProps {
  basePath: string;
  WrapperComponent?: React.ComponentType<any>;
}

export function createEditionRoutes({
  basePath,
  WrapperComponent,
}: EditionRoutesProps) {
  const EditionComponent = WrapperComponent
    ? (props: any) => <WrapperComponent component={EditionView} {...props} />
    : EditionView;

  const SetDetailsComponent = WrapperComponent
    ? (props: any) => <WrapperComponent component={SetDetails} {...props} />
    : SetDetails;

  const ScheduleComponent = WrapperComponent
    ? (props: any) => <WrapperComponent component={Schedule} {...props} />
    : Schedule;

  return [
    <Route key="main" path={basePath} element={<EditionComponent />}>
      {/* Nested tab routes */}
      <Route index element={<ArtistsTab />} />
      <Route path="timeline" element={<TimelineTab />} />
      <Route path="map" element={<MapTab />} />
      <Route path="info" element={<InfoTab />} />
      <Route path="social" element={<SocialTab />} />
    </Route>,
    <Route
      key="sets"
      path={`${basePath}/sets/:setSlug`}
      element={<SetDetailsComponent />}
    />,
    <Route
      key="schedule"
      path={`${basePath}/schedule`}
      element={<ScheduleComponent />}
    />,
  ];
}
