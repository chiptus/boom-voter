import { useParams } from "react-router-dom";
import { StageManagement } from "./StageManagement";

export default function FestivalStages() {
  const { editionSlug, festivalSlug } = useParams<{
    editionSlug: string;
    festivalSlug: string;
  }>();

  if (!editionSlug || !festivalSlug) {
    return <div>Edition not found</div>;
  }

  return (
    <StageManagement editionSlug={editionSlug} festivalSlug={festivalSlug} />
  );
}
