import { CardDescription } from "@/components/ui/card";
import { Artist } from "@/services/queries";

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
        {artists.map((a) => a.name).join(", ")}
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
