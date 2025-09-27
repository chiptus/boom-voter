interface SetAudioPlayerProps {
  soundcloudUrl: string;
  isActive?: boolean;
}

export function SetAudioPlayer({
  soundcloudUrl,
  isActive = true,
}: SetAudioPlayerProps) {
  if (!isActive || !soundcloudUrl) {
    return null;
  }

  // Build SoundCloud iframe URL with parameters
  const baseUrl = "https://w.soundcloud.com/player/";
  const encodedUrl = encodeURIComponent(soundcloudUrl);
  const params = new URLSearchParams({
    url: encodedUrl,
    auto_play: "true",
    color: "8b5cf6",
    buying: "false",
    sharing: "false",
    show_artwork: "false",
    show_playcount: "false",
    show_user: "false",
    single_active: "true",
    download: "false",
    // start_track: "0",
  });
  const widgetUrl = `${baseUrl}?${params.toString()}`;

  return (
    <div className="relative">
      {/* SoundCloud iframe player */}
      <iframe
        width="100%"
        height="100"
        allow="autoplay"
        src={widgetUrl}
        className="rounded-lg"
      />
    </div>
  );
}
