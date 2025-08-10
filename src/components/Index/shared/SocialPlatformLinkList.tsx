import { SocialPlatformLink } from "./SocialPlatformLink";
import { getSocialPlatformLogo } from "./SocialPlatformUtils";

interface Artist {
  id: string;
  name: string;
  spotify_url?: string | null;
  soundcloud_url?: string | null;
}

interface SocialPlatformLinkListProps {
  artist: Artist;
  size?: "sm" | "md";
}

export function SocialPlatformLinkList({
  artist,
  size = "md",
}: SocialPlatformLinkListProps) {
  const hasSpotify =
    artist.spotify_url && getSocialPlatformLogo(artist.spotify_url);
  const hasSoundcloud =
    artist.soundcloud_url && getSocialPlatformLogo(artist.soundcloud_url);

  if (!hasSpotify && !hasSoundcloud) {
    return null;
  }

  return (
    <div className="flex items-center gap-1">
      {hasSpotify && artist.spotify_url && (
        <SocialPlatformLink
          url={artist.spotify_url}
          artistName={artist.name}
          size={size}
        />
      )}
      {hasSoundcloud && artist.soundcloud_url && (
        <SocialPlatformLink
          url={artist.soundcloud_url}
          artistName={artist.name}
          size={size}
        />
      )}
    </div>
  );
}
