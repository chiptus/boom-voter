import { Navigate, Route } from "react-router-dom";
import EditionView from "@/pages/EditionView";
import { SetDetails } from "@/pages/SetDetails";

// Tab components
import { ArtistsTab } from "@/pages/tabs/ArtistsTab";
import { MapTab } from "@/pages/tabs/MapTab";
import { InfoTab } from "@/pages/tabs/InfoTab";
import { SocialTab } from "@/pages/tabs/SocialTab";
import { ScheduleTabTimeline } from "@/pages/tabs/ScheduleTabTimeline";
import { ScheduleTabList } from "@/pages/tabs/ScheduleTabList";
import { ScheduleTab } from "@/pages/tabs/ScheduleTab";

interface EditionRoutesProps {
  basePath: string;
  WrapperComponent?: React.ComponentType<any>;
}

export function createEditionRoutes({
  basePath,
  WrapperComponent,
}: EditionRoutesProps) {
  const EditionComponent = WrapperComponent
    ? () => <WrapperComponent component={EditionView} />
    : EditionView;

  const SetDetailsComponent = WrapperComponent
    ? () => <WrapperComponent component={SetDetails} />
    : SetDetails;

  return [
    <Route key="main" path={basePath} element={<EditionComponent />}>
      {/* Nested tab routes */}
      <Route index element={<Navigate to="sets" replace />} />
      <Route path="sets" element={<ArtistsTab />} />
      <Route path="map" element={<MapTab />} />
      <Route path="info" element={<InfoTab />} />
      <Route path="social" element={<SocialTab />} />
      <Route path="schedule" element={<ScheduleTab />}>
        <Route index element={<Navigate to="timeline" replace />} />
        <Route path="timeline" element={<ScheduleTabTimeline />} />
        <Route path="list" element={<ScheduleTabList />} />
      </Route>
    </Route>,
    <Route
      key="sets"
      path={`${basePath}/sets/:setSlug`}
      element={<SetDetailsComponent />}
    />,
  ];
}
