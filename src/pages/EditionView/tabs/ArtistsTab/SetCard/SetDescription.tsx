import { CardDescription } from "@/components/ui/card";
import { MultiArtistInfo } from "./MultiArtistInfo";
import { useFestivalSet } from "../FestivalSetContext";

interface SetDescriptionProps {
  className?: string;
}

export function SetDescription({
  className = "text-purple-200 text-sm leading-relaxed",
}: SetDescriptionProps) {
  const { set } = useFestivalSet();
  const isMultiArtist = set.artists.length > 1;

  if (isMultiArtist) {
    return (
      <CardDescription className={className}>
        <div className="space-y-3">
          <div>{set.description}</div>
          <div className="flex gap-4 items-center">
            <span className="font-medium">Artists:</span>{" "}
            <MultiArtistInfo artists={set.artists} />
          </div>
        </div>
      </CardDescription>
    );
  }

  if (set.description) {
    return (
      <CardDescription className={className}>{set.description}</CardDescription>
    );
  }

  return null;
}
