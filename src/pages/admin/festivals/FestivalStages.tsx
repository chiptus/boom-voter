import { useParams } from "react-router-dom";
import { StageManagement } from "./StageManagement";

export default function FestivalStages() {
  const { editionId } = useParams<{ editionId: string }>();

  if (!editionId) {
    return <div>Edition not found</div>;
  }

  return <StageManagement editionId={editionId} />;
}
