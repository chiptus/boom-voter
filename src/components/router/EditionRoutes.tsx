import { Navigate, Route } from "react-router-dom";
import EditionView from "@/pages/EditionView/EditionView";
import { SetDetails } from "@/pages/SetDetails";

// Tab components
import { ArtistsTab } from "@/pages/EditionView/tabs/ArtistsTab/ArtistsTab";
import { MapTab } from "@/pages/EditionView/tabs/MapTab";
import { InfoTab } from "@/pages/EditionView/tabs/InfoTab";
import { SocialTab } from "@/pages/EditionView/tabs/SocialTab";
import { ScheduleTabTimeline } from "@/pages/EditionView/tabs/ScheduleTab/TimelineTab";
import { ScheduleTabList } from "@/pages/EditionView/tabs/ScheduleTab/list/ListTab";
import { ScheduleTab } from "@/pages/EditionView/tabs/ScheduleTab";

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
