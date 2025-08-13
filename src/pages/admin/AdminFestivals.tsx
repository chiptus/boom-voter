import { useState } from "react";
import { Outlet, useNavigate, useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Plus } from "lucide-react";
import { FestivalDialog } from "@/components/Admin/FestivalDialog";
import { FestivalManagementTable } from "@/components/Admin/FestivalManagementTable";
import { Festival } from "@/hooks/queries/festivals/useFestivals";
import { Button } from "@/components/ui/button";

export default function AdminFestivals() {
  const [editingFestival, setEditingFestival] = useState<Festival | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const navigate = useNavigate();
  const { festivalId = "" } = useParams<{
    festivalId?: string;
  }>();

  const handleFestivalChange = (festivalId: string) => {
    if (festivalId === "none") {
      navigate("/admin/festivals");
    } else {
      navigate(`/admin/festivals/${festivalId}`);
    }
  };

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
            selected={festivalId}
          />
        </CardContent>
      </Card>

      <div className="mt-4">
        <Outlet />
      </div>

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
}
