import { useFestivalEdition } from "@/contexts/FestivalEditionContext";
import { useFestivalInfoQuery } from "@/hooks/queries/festival-info/useFestivalInfo";

export function MapTab() {
  const { festival } = useFestivalEdition();
  const { data: festivalInfo, isLoading } = useFestivalInfoQuery(festival?.id);

  if (isLoading) {
    return (
      <div className="text-center text-purple-300 py-12">
        <p>Loading map...</p>
      </div>
    );
  }

  if (!festivalInfo?.map_image_url) {
    return (
      <div className="text-center text-purple-300 py-12">
        <p>Festival map not available yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-xl font-semibold text-white mb-4">Festival Map</h2>
      </div>

      <div className="bg-white/5 rounded-lg p-4">
        <img
          src={festivalInfo.map_image_url}
          alt="Festival Map"
          className="w-full h-auto rounded-lg"
          style={{ maxHeight: "80vh", objectFit: "contain" }}
        />
      </div>
    </div>
  );
}
