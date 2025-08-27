import { SocialLinkItem } from "./SocialLinkItem";

export interface CustomLink {
  title: string;
  url: string;
}

interface CustomLinksProps {
  links: CustomLink[];
}

export function CustomLinks({ links }: CustomLinksProps) {
  return (
    <div className="bg-white/5 rounded-lg p-6">
      <h3 className="text-lg font-semibold text-white mb-4">Links</h3>
      <div className="space-y-3">
        {links.map((link, index) => (
          <SocialLinkItem key={index} link={link} />
        ))}
      </div>
    </div>
  );
}
