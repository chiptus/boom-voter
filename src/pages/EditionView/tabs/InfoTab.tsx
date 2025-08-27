import { useFestivalEdition } from "@/contexts/FestivalEditionContext";
import {
  useFestivalInfoQuery,
  CustomLink,
} from "@/hooks/queries/festival-info/useFestivalInfo";
import { ExternalLink } from "lucide-react";

export function InfoTab() {
  const { edition, festival } = useFestivalEdition();
  const { data: festivalInfo, isLoading } = useFestivalInfoQuery(festival?.id);

  if (isLoading) {
    return (
      <div className="text-center text-purple-300 py-12">
        <p>Loading festival information...</p>
      </div>
    );
  }

  const customLinks = (festivalInfo?.custom_links as CustomLink[]) || [];

  return (
    <div className="space-y-8">
      <div className="text-center space-y-2 md:space-y-4">
        <p className="text-lg md:text-xl text-purple-200 font-medium mb-2 md:mb-4">
          {edition?.name}
        </p>
      </div>

      {festivalInfo?.info_text && (
        <div className="bg-white/5 rounded-lg p-6">
          <div
            className="prose prose-invert max-w-none text-purple-100"
            dangerouslySetInnerHTML={{ __html: festivalInfo.info_text }}
          />
        </div>
      )}

      {/* Custom Links */}
      {customLinks.length > 0 && (
        <div className="bg-white/5 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Links</h3>
          <div className="space-y-3">
            {customLinks.map((link, index) => (
              <a
                key={index}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors group"
              >
                <div className="flex-1">
                  <span className="text-white font-medium">{link.title}</span>
                </div>
                <ExternalLink className="h-4 w-4 text-purple-300 group-hover:text-white transition-colors" />
              </a>
            ))}
          </div>
        </div>
      )}

      {!festivalInfo?.info_text && customLinks.length === 0 && (
        <div className="text-center text-purple-300 py-12">
          <p>Festival information not available yet.</p>
        </div>
      )}
    </div>
  );
}
