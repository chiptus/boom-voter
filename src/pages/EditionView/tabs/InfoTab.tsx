import { useFestivalEdition } from "@/contexts/FestivalEditionContext";
import { useFestivalInfoQuery } from "@/hooks/queries/festival-info/useFestivalInfo";
import { EditionTitle } from "./InfoTab/EditionTitle";
import { InfoText } from "./InfoTab/InfoText";
import { CustomLinks } from "./InfoTab/CustomLinks";
import { NoInfo } from "./InfoTab/NoInfo";
import { LoadingInfo } from "./InfoTab/LoadingInfo";
import { SocialLinkItem } from "./InfoTab/SocialLinkItem";
import { TitleSection } from "@/components/layout/AppHeader/TitleSection";
import { useCustomLinksQuery } from "@/hooks/queries/custom-links/useCustomLinks";

export function InfoTab() {
  const { edition, festival } = useFestivalEdition();
  const { data: festivalInfo, isLoading } = useFestivalInfoQuery(festival?.id);
  const customLinksQuery = useCustomLinksQuery(festival?.id || "");
  if (isLoading) {
    return <LoadingInfo />;
  }

  const customLinks = customLinksQuery.data || [];
  const noInfoAvailable =
    !festivalInfo?.info_text &&
    !festivalInfo?.facebook_url &&
    !festivalInfo?.instagram_url &&
    customLinks.length === 0;

  return (
    <div className="space-y-8">
      <TitleSection logoUrl={festival?.logo_url} title={festival?.name} />
      <EditionTitle name={edition?.name} />

      {festivalInfo?.info_text && (
        <InfoText infoText={festivalInfo.info_text} />
      )}

      {customLinks.length > 0 && <CustomLinks links={customLinks} />}

      {festivalInfo?.facebook_url ? (
        <SocialLinkItem
          link={{ title: "Facebook", url: festivalInfo.facebook_url }}
        />
      ) : null}

      {festivalInfo?.instagram_url ? (
        <SocialLinkItem
          link={{ title: "Instagram", url: festivalInfo.instagram_url }}
        />
      ) : null}

      {noInfoAvailable && <NoInfo />}
    </div>
  );
}
