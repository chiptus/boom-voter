import { useParams, useLocation, useNavigate, Outlet } from "react-router-dom";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, MapPin, Music } from "lucide-react";
import { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useFestivalEditionsForFestivalQuery } from "@/hooks/queries/festivals/editions/useFestivalEditionsForFestival";

export default function FestivalEdition() {
  const { festivalId, editionId } = useParams<{
    festivalId: string;
    editionId: string;
  }>();
  const location = useLocation();
  const navigate = useNavigate();

  // Redirect to stages if we're at the index route
  useEffect(() => {
    if (
      festivalId &&
      editionId &&
      location.pathname ===
        `/admin/festivals/${festivalId}/editions/${editionId}`
    ) {
      navigate(`/admin/festivals/${festivalId}/editions/${editionId}/stages`);
    }
  }, [location.pathname, festivalId, editionId, navigate]);

  const editionsQuery = useFestivalEditionsForFestivalQuery(festivalId);

  if (!festivalId || !editionId) {
    return <div>Festival or edition not found</div>;
  }

  if (editionsQuery.isLoading) {
    return <Card>Loading edition data</Card>;
  }

  if (editionsQuery.isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center p-8">
          <Loader2 className="h-6 w-6 animate-spin mr-2" />
          <span>Loading festivals...</span>
        </CardContent>
      </Card>
    );
  }

  const currentEdition = editionsQuery.data?.find((f) => f.id === editionId);

  if (!currentEdition) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center p-8">
          <span>Edition not found</span>
        </CardContent>
      </Card>
    );
  }

  // Determine current subtab based on URL
  function getCurrentSubTab() {
    const path = location.pathname;
    if (path.includes("/sets")) return "sets";
    return "stages";
  }

  const currentSubTab = getCurrentSubTab();

  function handleSubTabChange(value: string) {
    navigate(`/admin/festivals/${festivalId}/editions/${editionId}/${value}`);
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              Edition: {currentEdition.name}
            </span>
          </CardTitle>
        </CardHeader>
      </Card>
      <Tabs
        value={currentSubTab}
        onValueChange={handleSubTabChange}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-2 bg-white/10 backdrop-blur-md">
          <TabsTrigger
            value="stages"
            className="data-[state=active]:bg-purple-600 data-[state=active]:text-white text-white"
          >
            <MapPin className="h-4 w-4 mr-2" />
            Stages
          </TabsTrigger>
          <TabsTrigger
            value="sets"
            className="data-[state=active]:bg-purple-600 data-[state=active]:text-white text-white"
          >
            <Music className="h-4 w-4 mr-2" />
            Sets
          </TabsTrigger>
        </TabsList>

        <div className="mt-6">
          <Outlet />
        </div>
      </Tabs>
    </div>
  );
}
