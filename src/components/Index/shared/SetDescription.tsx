import { CardDescription } from "@/components/ui/card";
import { Artist } from "@/services/queries";
import { MultiArtistInfo } from "./MultiArtistInfo";

interface SetDescriptionProps {
  artists: Artist[];
  setDescription?: string | null;
  className?: string;
}

export function SetDescription({
  artists,
  setDescription,
  className = "text-purple-200 text-sm leading-relaxed",
}: SetDescriptionProps) {
  const isMultiArtist = artists.length > 1;

  if (isMultiArtist) {
    return (
      <CardDescription className={className}>
        <div className="space-y-3">
          <p>{setDescription}</p>
          <div className="flex gap-4 items-center">
            <span className="font-medium">Artists:</span>{" "}
            <MultiArtistInfo artists={artists} />
          </div>
        </div>
      </CardDescription>
    );
  }

  if (setDescription) {
    return (
      <CardDescription className={className}>{setDescription}</CardDescription>
    );
  }

  return null;
}
