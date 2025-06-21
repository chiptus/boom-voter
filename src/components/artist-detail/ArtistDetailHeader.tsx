import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export const ArtistDetailHeader = () => {
  return (
    <div className="mb-6">
      <Link to="/">
        <Button variant="outline" className="border-purple-400 text-purple-400 hover:bg-purple-400 hover:text-white">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Artists
        </Button>
      </Link>
    </div>
  );
};