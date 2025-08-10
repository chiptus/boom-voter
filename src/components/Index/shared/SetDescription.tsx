import { CardDescription } from "@/components/ui/card";
import { Artist } from "@/services/queries";
import { MultiArtistSocialPlatformLinks } from "./MultiArtistSocialPlatformLinks";

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
        <span className="font-medium">Artists:</span>{" "}
        <MultiArtistSocialPlatformLinks artists={artists} />
        {setDescription && (
          <>
            <br />
            <br />
            {setDescription}
          </>
        )}
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
