import { Music } from "lucide-react";
import {
  useArtistSoundcloudPlaylist,
  isSoundCloudError,
} from "@/hooks/useArtistSoundcloudPlaylist";

interface SetAudioPlayerProps {
  soundcloudUrl: string;
  isActive?: boolean;
}

export function SetAudioPlayer({
  soundcloudUrl,
  isActive = true,
}: SetAudioPlayerProps) {
  const playlistQuery = useArtistSoundcloudPlaylist({
    soundcloudUrl,
    enabled: isActive,
  });

  if (playlistQuery.error || !soundcloudUrl || !playlistQuery.data) {
    // Show different messages based on error code
    let errorMessage = "Audio unavailable";
    if (isSoundCloudError(playlistQuery.error)) {
      switch (playlistQuery.error.code) {
        case "CONTENT_NOT_FOUND":
          errorMessage = "Content not found";
          break;
        case "ACCESS_DENIED":
          errorMessage = "Access denied";
          break;
        case "SERVICE_CONFIG_ERROR":
          errorMessage = "Service unavailable";
          break;
        default:
          errorMessage = "Audio unavailable";
      }
    }

    return (
      <div className="flex items-center gap-2 bg-black/50 backdrop-blur-sm rounded-lg p-2 opacity-50">
        <Music className="h-4 w-4 text-white/60" />
        <span className="text-xs text-white/60">{errorMessage}</span>
      </div>
    );
  }

  // Show loading state
  if (playlistQuery.isLoading) {
    return (
      <div className="flex items-center gap-2 bg-black/50 backdrop-blur-sm rounded-lg p-2">
        <div className="h-4 w-4 animate-spin border-2 border-white/30 border-t-white rounded-full" />
        <span className="text-xs text-white/80">Loading...</span>
      </div>
    );
  }
  const playlist = playlistQuery.data;

  // Build SoundCloud iframe URL with parameters
  const widgetUrl = `https://w.soundcloud.com/player/?url=${encodeURIComponent(playlist.permalink_url)}&auto_play=false&color=8b5cf6&buying=false&sharing=false&show_artwork=true&show_playcount=false&show_user=false&single_active=true`;

  return (
    <div className="relative">
      {/* Show playlist title if available */}
      {playlist?.title && (
        <div className="flex items-center gap-2 mb-2">
          <Music className="h-3 w-3 text-purple-400 flex-shrink-0" />
          <span className="text-xs text-white/80 truncate">
            {playlist.title}
          </span>
        </div>
      )}

      {/* SoundCloud iframe player */}
      <iframe
        width="100%"
        height="166"
        allow="autoplay"
        src={widgetUrl}
        className="rounded-lg"
      />
    </div>
  );
}
