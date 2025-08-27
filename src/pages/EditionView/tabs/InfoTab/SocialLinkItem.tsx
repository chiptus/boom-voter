import { ExternalLink } from "lucide-react";
import type { CustomLink } from "./CustomLinks";

interface SocialLinkItemProps {
  link: CustomLink;
}

export function SocialLinkItem({ link }: SocialLinkItemProps) {
  return (
    <a
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
  );
}
