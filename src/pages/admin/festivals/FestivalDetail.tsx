import { useParams, useNavigate, Outlet, Link } from "react-router-dom";
import { FestivalEditionManagement } from "./FestivalEditionManagement";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useFestivalBySlugQuery } from "@/hooks/queries/festivals/useFestivalBySlug";
import { Button } from "@/components/ui/button";
import { Loader2, Info } from "lucide-react";

export default function FestivalDetail() {
  const { festivalSlug, editionSlug = "" } = useParams<{
    festivalSlug: string;
    editionSlug?: string;
  }>();
  // const [selectedEditionId, setSelectedEditionId] = useState("");
  const navigate = useNavigate();

  const festivalQuery = useFestivalBySlugQuery(festivalSlug);

  if (!festivalSlug) {
    return <div>festivalSlug param is missing</div>;
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

  function handleEditionSelect(editionSlug: string) {
    navigate(`/admin/festivals/${festivalSlug}/editions/${editionSlug}/stages`);
  }

  const festival = festivalQuery.data;

  return (
    <>
      <>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">{festival.name}</span>
              <Button asChild variant="outline">
                <Link to={`./info`}>
                  <Info className="h-4 w-4 mr-2" />
                  Festival Info
                </Link>
              </Button>
            </CardTitle>
          </CardHeader>
        </Card>

        <div className="mt-6">
          <FestivalEditionManagement
            festivalSlug={festivalSlug}
            onSelect={(editionSlug) => {
              handleEditionSelect(editionSlug);
            }}
            selected={editionSlug}
          />
        </div>
      </>

      <div className="mt-6">
        <Outlet />
      </div>
    </>
  );
}
