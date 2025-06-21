import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Music } from "lucide-react";

export const ArtistNotFoundState = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
      <div className="text-center">
        <Music className="h-16 w-16 text-purple-400 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-white mb-4">Artist not found</h2>
        <Link to="/">
          <Button className="bg-purple-600 hover:bg-purple-700">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Artists
          </Button>
        </Link>
      </div>
    </div>
  );
};