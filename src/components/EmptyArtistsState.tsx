
import { Music } from "lucide-react";

export const EmptyArtistsState = () => {
  return (
    <div className="text-center py-12">
      <Music className="h-16 w-16 text-purple-400 mx-auto mb-4" />
      <h3 className="text-xl font-semibold text-white mb-2">No artists yet!</h3>
      <p className="text-purple-200">Be the first to add an artist to vote on.</p>
    </div>
  );
};
