export function getSocialPlatformLogo(url: string) {
  if (url.includes("spotify.com")) {
    return {
      logo: "https://storage.googleapis.com/pr-newsroom-wp/1/2023/05/Spotify_Primary_Logo_RGB_Green.png",
      platform: "Spotify",
      color: "text-green-400 hover:text-green-300",
    };
  }
  if (url.includes("soundcloud.com")) {
    return {
      logo: "https://d21buns5ku92am.cloudfront.net/26628/documents/54546-1717072325-sc-logo-cloud-black-7412d7.svg",
      platform: "SoundCloud",
      color: "text-orange-400 hover:text-orange-300",
    };
  }
  return null;
}
