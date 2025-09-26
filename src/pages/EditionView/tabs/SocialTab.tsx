import { useFestivalEdition } from "@/contexts/FestivalEditionContext";
import { useFestivalInfoQuery } from "@/hooks/queries/festival-info/useFestivalInfo";
import { PageTitle } from "@/components/PageTitle/PageTitle";

function extractFacebookPageId(url: string): string | null {
  // Extract Facebook page ID/username from various Facebook URL formats
  const patterns = [/facebook\.com\/([^/?]+)/, /fb\.com\/([^/?]+)/];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) {
      return match[1];
    }
  }
  return null;
}

function extractInstagramUsername(url: string): string | null {
  // Extract Instagram username from URL
  const pattern = /instagram\.com\/([^/?]+)/;
  const match = url.match(pattern);
  return match ? match[1] : null;
}

export function SocialTab() {
  const { festival } = useFestivalEdition();
  const { data: festivalInfo, isLoading } = useFestivalInfoQuery(festival?.id);

  if (isLoading || !festivalInfo) {
    return (
      <>
        <PageTitle title="Social" prefix={festival?.name} />
        <div className="text-center text-purple-300 py-12">
          <p>Loading social feeds...</p>
        </div>
      </>
    );
  }

  const facebookPageId = festivalInfo.facebook_url
    ? extractFacebookPageId(festivalInfo.facebook_url)
    : null;
  const instagramUsername = festivalInfo.instagram_url
    ? extractInstagramUsername(festivalInfo.instagram_url)
    : null;

  if (!facebookPageId && !instagramUsername) {
    return (
      <>
        <PageTitle title="Social" prefix={festival?.name} />
        <div className="text-center text-purple-300 py-12">
          <p>Social feeds not available yet.</p>
        </div>
      </>
    );
  }

  return (
    <>
      <PageTitle title="Social" prefix={festival?.name} />
      <>Unavailable</>
    </>
  );

  // return (
  //   <div className="space-y-8">
  //     <div className="text-center">
  //       <h2 className="text-xl font-semibold text-white mb-4">Follow Us</h2>
  //     </div>

  //     <div className="grid gap-8 lg:grid-cols-2">
  //       {/* Facebook Embed */}
  //       {facebookPageId && festivalInfo.facebook_url && (
  //         <div className="bg-white/5 rounded-lg p-6">
  //           <div className="flex items-center justify-between mb-4">
  //             <h3 className="text-lg font-semibold text-white">Facebook</h3>
  //             <a
  //               href={festivalInfo.facebook_url}
  //               target="_blank"
  //               rel="noopener noreferrer"
  //               className="flex items-center gap-2 text-purple-300 hover:text-white transition-colors"
  //             >
  //               <span className="text-sm">View on Facebook</span>
  //               <ExternalLink className="h-4 w-4" />
  //             </a>
  //           </div>

  //           <div className="relative">
  //             <iframe
  //               src={`https://www.facebook.com/plugins/page.php?href=https%3A%2F%2Fwww.facebook.com%2Fprofile.php%3Fid%3D${facebookPageId}&tabs=timeline&width=340&height=500&small_header=false&adapt_container_width=true&hide_cover=false&show_facepile=true&appId=965566121330166`}
  //               width="100%"
  //               height="500"
  //               style={{ border: "none", overflow: "hidden" }}
  //               scrolling="no"
  //               frameBorder="0"
  //               allowFullScreen={true}
  //               allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
  //               className="rounded-lg"
  //             />
  //           </div>
  //         </div>
  //       )}

  //       {/* Instagram Embed */}
  //       {festivalInfo.instagram_url && instagramUsername && (
  //         <div className="bg-white/5 rounded-lg p-6">
  //           <div className="flex items-center justify-between mb-4">
  //             <h3 className="text-lg font-semibold text-white">Instagram</h3>
  //             <a
  //               href={festivalInfo.instagram_url}
  //               target="_blank"
  //               rel="noopener noreferrer"
  //               className="flex items-center gap-2 text-purple-300 hover:text-white transition-colors"
  //             >
  //               <span className="text-sm">View on Instagram</span>
  //               <ExternalLink className="h-4 w-4" />
  //             </a>
  //           </div>

  //           <div className="relative">
  //             {/* Instagram doesn't provide a direct embed like Facebook, so we show a link with preview */}
  //             <div className="text-center space-y-4 p-8 border border-purple-400/20 rounded-lg">
  //               <div className="text-purple-300">
  //                 <svg
  //                   className="h-12 w-12 mx-auto mb-4"
  //                   fill="currentColor"
  //                   viewBox="0 0 24 24"
  //                 >
  //                   <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987s11.987-5.367 11.987-11.987C24.004 5.367 18.637.001 12.017.001zM8.449 16.988c-1.297 0-2.448-.49-3.337-1.295C3.595 14.24 2.921 12.41 2.921 10.4c0-2.016.674-3.845 2.191-5.295C6.001 3.65 7.152 3.16 8.449 3.16c1.295 0 2.448.49 3.336 1.295 1.517 1.45 2.192 3.28 2.192 5.295 0 2.01-.675 3.84-2.192 5.29-.888.805-2.041 1.295-3.336 1.295zm7.718 0c-1.297 0-2.449-.49-3.337-1.295-1.516-1.45-2.191-3.28-2.191-5.29 0-2.016.675-3.845 2.191-5.295.888-.805 2.04-1.295 3.337-1.295 1.296 0 2.448.49 3.336 1.295C20.02 6.555 20.695 8.384 20.695 10.4c0 2.01-.675 3.84-2.192 5.29-.888.805-2.04 1.295-3.336 1.295z" />
  //                 </svg>
  //               </div>
  //               <p className="text-white font-medium">@{instagramUsername}</p>
  //               <p className="text-purple-300 text-sm">
  //                 Follow us on Instagram for the latest updates and
  //                 behind-the-scenes content!
  //               </p>
  //               <a
  //                 href={festivalInfo.instagram_url}
  //                 target="_blank"
  //                 rel="noopener noreferrer"
  //                 className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
  //               >
  //                 <span>Follow on Instagram</span>
  //                 <ExternalLink className="h-4 w-4" />
  //               </a>
  //             </div>
  //           </div>
  //         </div>
  //       )}
  //     </div>
  //   </div>
  // );
}
