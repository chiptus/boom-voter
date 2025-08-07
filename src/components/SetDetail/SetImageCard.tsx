import { Card, CardContent } from "@/components/ui/card";
import { ArtistImageLoader } from "@/components/ArtistImageLoader";

interface ArtistImageCardProps {
  imageUrl?: string | null;
  artistName: string;
}

export const ArtistImageCard = ({
  imageUrl,
  artistName,
}: ArtistImageCardProps) => {
  return (
    <div className="lg:col-span-1">
      <Card className="bg-white/10 backdrop-blur-md border-purple-400/30">
        <CardContent className="p-6">
          <ArtistImageLoader
            src={imageUrl}
            alt={artistName}
            className="w-full aspect-square rounded-lg shadow-lg"
          />
        </CardContent>
      </Card>
    </div>
  );
};
