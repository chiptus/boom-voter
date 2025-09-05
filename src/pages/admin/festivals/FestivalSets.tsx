import { useParams } from "react-router-dom";
import { SetManagement } from "./SetsManagement/SetManagement";

export default function FestivalSets() {
  const { editionSlug, festivalSlug } = useParams<{
    editionSlug: string;
    festivalSlug: string;
  }>();

  if (!editionSlug || !festivalSlug) {
    return <div>Edition not found</div>;
  }

  return (
    <SetManagement editionSlug={editionSlug} festivalSlug={festivalSlug} />
  );
}
