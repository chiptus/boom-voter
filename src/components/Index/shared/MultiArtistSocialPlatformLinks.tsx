import { SocialPlatformLinkList } from "./SocialPlatformLinkList";
import { getSocialPlatformLogo } from "./SocialPlatformUtils";

interface Artist {
  id: string;
  name: string;
  spotify_url?: string | null;
  soundcloud_url?: string | null;
}

interface MultiArtistSocialPlatformLinksProps {
  artists: Artist[];
  size?: "sm" | "md";
}

export function MultiArtistSocialPlatformLinks({
  artists,
  size = "md",
}: MultiArtistSocialPlatformLinksProps) {
  const artistsWithLinks = artists.filter((artist) => {
    const hasSpotify =
      artist.spotify_url && getSocialPlatformLogo(artist.spotify_url);
    const hasSoundcloud =
      artist.soundcloud_url && getSocialPlatformLogo(artist.soundcloud_url);
    return hasSpotify || hasSoundcloud;
  });

  if (artistsWithLinks.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-col gap-1">
      {artistsWithLinks.map((artist) => (
        <div key={artist.id} className="flex items-center gap-1">
          <span className="text-xs text-purple-200 mr-1">{artist.name}:</span>
          <SocialPlatformLinkList artist={artist} size={size} />
        </div>
      ))}
    </div>
  );
}
