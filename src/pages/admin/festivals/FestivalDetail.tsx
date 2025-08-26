import { useParams, useNavigate, Outlet } from "react-router-dom";
import { FestivalEditionManagement } from "./FestivalEditionManagement";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useFestivalQuery } from "@/hooks/queries/festivals/useFestival";
import { Loader2 } from "lucide-react";

export default function FestivalDetail() {
  const { festivalId, editionId = "" } = useParams<{
    festivalId: string;
    editionId?: string;
  }>();
  // const [selectedEditionId, setSelectedEditionId] = useState("");
  const navigate = useNavigate();

  const festivalQuery = useFestivalQuery(festivalId);

  if (!festivalId) {
    return <div>festivalId param is missing</div>;
  }

  if (festivalQuery.isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center p-8">
          <Loader2 className="h-6 w-6 animate-spin mr-2" />
          <span>Loading festivals...</span>
        </CardContent>
      </Card>
    );
  }

  if (!festivalQuery.data) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center p-8">
          <span>Fesitval not found</span>
        </CardContent>
      </Card>
    );
  }

  function handleEditionSelect(editionId: string) {
    navigate(`/admin/festivals/${festivalId}/editions/${editionId}/stages`);
  }

  const festival = festivalQuery.data;

  return (
    <>
      <>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">{festival.name}</span>
            </CardTitle>
          </CardHeader>
        </Card>

        <div className="mt-6">
          <FestivalEditionManagement
            festivalId={festivalId}
            onSelect={(editionId) => {
              handleEditionSelect(editionId);
            }}
            selected={editionId}
          />
        </div>
      </>

      <div className="mt-6">
        <Outlet />
      </div>
    </>
  );
}
