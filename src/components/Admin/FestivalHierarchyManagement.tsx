import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  useFestivalEditionsQuery,
  useFestivalQuery,
} from "@/hooks/queries/useFestivalQuery";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, MapPin, Music, Loader2, Plus } from "lucide-react";

import { FestivalManagementTable } from "./FestivalManagementTable";
import { FestivalEditionManagement } from "./FestivalEditionManagement";
import { StageManagement } from "./StageManagement";
import { SetManagement } from "./SetManagement";
import { Button } from "../ui/button";
import { Festival } from "@/services/queries";
import { FestivalDialog } from "./FestivalDialog";

export const FestivalHierarchyManagement = () => {
  const [editingFestival, setEditingFestival] = useState<Festival | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const { data: festivals = [], isLoading } = useFestivalQuery.useFestivals();
  const navigate = useNavigate();
  const { festivalId, subtab } = useParams<{
    festivalId?: string;
    editionId?: string;
    subtab?: string;
  }>();
  const editionsQuery = useFestivalEditionsQuery(festivalId);
  const [selectedFestival, setSelectedFestival] = useState<string>("");
  const [selectedEdition, setSelectedEdition] = useState<string>("");

  // Initialize festival and tab from URL params
  useEffect(() => {
    if (festivalId && festivals.some((f) => f.id === festivalId)) {
      setSelectedFestival(festivalId);
    }
  }, [festivalId, festivals]);

  const selectedFestivalData = festivals.find((f) => f.id === selectedFestival);
  const selectedEditionData = editionsQuery.data?.find(
    (f) => f.id === selectedEdition,
  );

  const handleFestivalChange = (festivalId: string) => {
    if (festivalId === "none") {
      setSelectedFestival("");
      navigate("/admin/festivals");
    } else {
      setSelectedFestival(festivalId);
      navigate(`/admin/festivals/${festivalId}`);
    }
  };

  const handleEditionChange = (editionId: string) => {
    if (editionId === "none") {
      setSelectedEdition("");
      navigate("/admin/festivals");
    } else {
      setSelectedEdition(editionId);
      navigate(`/admin/festivals/${festivalId}/${editionId}/stages`);
    }
  };

  const handleSubTabChange = (value: string) => {
    if (selectedFestival && selectedFestival !== "none" && selectedEdition) {
      navigate(
        `/admin/festivals/${selectedFestival}/${selectedEdition}/${value}`,
      );
    }
  };

  const currentSubTab = subtab || "stages";

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
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Festival Management
            </span>

            <Button
              onClick={handleCreate}
              className="bg-purple-600 hover:bg-purple-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Festival
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <FestivalManagementTable
            onEdit={(festival) => {
              setEditingFestival(festival);
              setIsEditDialogOpen(true);
            }}
            onSelect={(festival) => {
              handleFestivalChange(festival.id);
            }}
            selected={selectedFestival}
          />
        </CardContent>
      </Card>

      {selectedFestival && (
        <>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  {selectedFestivalData?.name}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <FestivalEditionManagement
                festivalId={selectedFestival}
                onSelect={(editionId) => {
                  handleEditionChange(editionId);
                }}
                selected={selectedEdition}
              />
              ;
            </CardContent>
          </Card>
        </>
      )}

      {selectedFestival && selectedEditionData && (
        <>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  Edition: {selectedEditionData.name}
                </span>
              </CardTitle>
            </CardHeader>
          </Card>
          <Tabs
            value={currentSubTab}
            onValueChange={handleSubTabChange}
            className="w-full"
          >
            <>
              <Card className="mt-6">
                <TabsList className="grid w-full grid-cols-4 bg-white/10 backdrop-blur-md">
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
              </Card>
            </>

            <TabsContent value="stages" className="mt-6">
              <StageManagement editionId={selectedEdition} />
            </TabsContent>

            <TabsContent value="sets" className="mt-6">
              <SetManagement editionId={selectedEdition} />;
            </TabsContent>
          </Tabs>
        </>
      )}
      <FestivalDialog
        open={isEditDialogOpen}
        onOpenChange={() => {
          setEditingFestival(null);
          setIsEditDialogOpen(false);
        }}
        editingFestival={editingFestival}
      />
    </div>
  );

  function handleCreate() {
    setEditingFestival(null);
    setIsEditDialogOpen(true);
  }
};
