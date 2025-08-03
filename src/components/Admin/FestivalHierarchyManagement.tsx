import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useFestivalQuery } from "@/hooks/queries/useFestivalQuery";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Calendar, CalendarDays, MapPin, Music, Loader2 } from "lucide-react";

import { FestivalManagement } from "./FestivalManagement";
import { FestivalEditionManagement } from "./FestivalEditionManagement";
import { StageManagement } from "./StageManagement";
import { SetManagement } from "./SetManagement";

export const FestivalHierarchyManagement = () => {
  const { data: festivals = [], isLoading } = useFestivalQuery.useFestivals();
  const navigate = useNavigate();
  const { festivalId, subtab } = useParams<{ festivalId?: string; subtab?: string }>();
  const [selectedFestival, setSelectedFestival] = useState<string>("");

  // Initialize festival and tab from URL params
  useEffect(() => {
    if (festivalId && festivals.some(f => f.id === festivalId)) {
      setSelectedFestival(festivalId);
    }
  }, [festivalId, festivals]);

  const selectedFestivalData = festivals.find(f => f.id === selectedFestival);

  const handleFestivalChange = (festivalId: string) => {
    if (festivalId === "none") {
      setSelectedFestival("");
      navigate("/admin/festivals");
    } else {
      setSelectedFestival(festivalId);
      navigate(`/admin/festivals/${festivalId}/festivals`);
    }
  };

  const handleSubTabChange = (value: string) => {
    if (selectedFestival && selectedFestival !== "none") {
      navigate(`/admin/festivals/${selectedFestival}/${value}`);
    }
  };

  const currentSubTab = subtab || "festivals";

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center p-8">
          <Loader2 className="h-6 w-6 animate-spin mr-2" />
          <span>Loading festivals...</span>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Festival Selection Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Festival Management
            </span>
            <div className="flex items-center gap-4">
              <Select value={selectedFestival || "none"} onValueChange={handleFestivalChange}>
                <SelectTrigger className="w-64">
                  <SelectValue placeholder="Select a festival to manage" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Select a festival</SelectItem>
                  {festivals.map((festival) => (
                    <SelectItem key={festival.id} value={festival.id}>
                      {festival.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {selectedFestivalData && (
                <Badge variant="outline" className="text-sm">
                  {selectedFestivalData.name}
                </Badge>
              )}
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {!selectedFestival ? (
            <div className="text-center py-8 text-muted-foreground">
              <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium mb-2">Festival Management</p>
              <p>Select a festival above to manage its editions, stages, and sets.</p>
              <p className="text-sm mt-2">Or use the "Festivals" tab to create and manage festivals.</p>
            </div>
          ) : (
            <div className="text-center py-4">
              <p className="text-sm text-muted-foreground">
                Managing <span className="font-medium">{selectedFestivalData?.name}</span>
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Management Tabs */}
      <Tabs value={currentSubTab} onValueChange={handleSubTabChange} className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-white/10 backdrop-blur-md">
          <TabsTrigger
            value="festivals"
            className="data-[state=active]:bg-purple-600 data-[state=active]:text-white"
          >
            <Calendar className="h-4 w-4 mr-2" />
            Festivals
          </TabsTrigger>
          <TabsTrigger
            value="editions"
            className="data-[state=active]:bg-purple-600 data-[state=active]:text-white"
            disabled={!selectedFestival}
          >
            <CalendarDays className="h-4 w-4 mr-2" />
            Editions
          </TabsTrigger>
          <TabsTrigger
            value="stages"
            className="data-[state=active]:bg-purple-600 data-[state=active]:text-white"
            disabled={!selectedFestival}
          >
            <MapPin className="h-4 w-4 mr-2" />
            Stages
          </TabsTrigger>
          <TabsTrigger
            value="sets"
            className="data-[state=active]:bg-purple-600 data-[state=active]:text-white"
            disabled={!selectedFestival}
          >
            <Music className="h-4 w-4 mr-2" />
            Sets
          </TabsTrigger>
        </TabsList>

        <TabsContent value="festivals" className="mt-6">
          <FestivalManagement />
        </TabsContent>

        <TabsContent value="editions" className="mt-6">
          {selectedFestival ? (
            <FestivalEditionManagementFiltered festivalId={selectedFestival} />
          ) : (
            <Card>
              <CardContent className="text-center py-8 text-muted-foreground">
                <CalendarDays className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Select a festival first to manage its editions</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="stages" className="mt-6">
          {selectedFestival ? (
            <StageManagementFiltered festivalId={selectedFestival} />
          ) : (
            <Card>
              <CardContent className="text-center py-8 text-muted-foreground">
                <MapPin className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Select a festival first to manage its stages</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="sets" className="mt-6">
          {selectedFestival ? (
            <SetManagementFiltered festivalId={selectedFestival} />
          ) : (
            <Card>
              <CardContent className="text-center py-8 text-muted-foreground">
                <Music className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Select a festival first to manage its sets</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

// Filtered components that only show data for the selected festival
const FestivalEditionManagementFiltered = ({ festivalId }: { festivalId: string }) => {
  return <FestivalEditionManagement festivalId={festivalId} />;
};

const StageManagementFiltered = ({ festivalId }: { festivalId: string }) => {
  return <StageManagement festivalId={festivalId} />;
};

const SetManagementFiltered = ({ festivalId }: { festivalId: string }) => {
  return <SetManagement festivalId={festivalId} />;
};