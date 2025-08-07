import { useParams } from "react-router-dom";
import { SetManagement } from "@/components/Admin/SetManagement";

export default function FestivalSets() {
  const { editionId } = useParams<{ editionId: string }>();

  if (!editionId) {
    return <div>Edition not found</div>;
  }

  return <SetManagement editionId={editionId} />;
}
