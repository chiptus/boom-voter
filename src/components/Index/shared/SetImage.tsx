import { Link } from "react-router-dom";
import { ArtistImageLoader } from "@/components/ArtistImageLoader";
import { MixedArtistImage } from "@/components/SetDetail/MixedArtistImage";
import { Artist } from "@/services/queries";

interface SetImageProps {
  artists: Artist[];
  setName: string;
  setSlug: string;
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function SetImage({
  artists,
  setName,
  setSlug,
  className = "",
  size = "lg",
}: SetImageProps) {
  const isMultiArtist = artists.length > 1;

  const sizeClasses = {
    sm: "w-12 h-12",
    md: "w-16 h-16",
    lg: "aspect-square w-full mb-4",
  };

  const containerClass = `${sizeClasses[size]} ${className} overflow-hidden rounded-lg hover:opacity-90 transition-opacity cursor-pointer`;

  return (
    <Link to={`./sets/${setSlug}`} className="block flex-shrink-0">
      {isMultiArtist ? (
        <MixedArtistImage
          artists={artists}
          setName={setName}
          className={containerClass}
        />
      ) : (
        <ArtistImageLoader
          src={artists[0]?.image_url}
          alt={setName}
          className={containerClass}
        />
      )}
    </Link>
  );
}
