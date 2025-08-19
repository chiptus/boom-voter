import { useState } from "react";
import { AddArtistDialog } from "@/components/Admin/AddArtistDialog";
import { AddGenreDialog } from "@/components/Admin/AddGenreDialog";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Music, Tag } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function AdminContent() {
  const [addArtistOpen, setAddArtistOpen] = useState(false);
  const [addGenreOpen, setAddGenreOpen] = useState(false);
  const { toast } = useToast();

  const handleArtistAdded = () => {
    setAddArtistOpen(false);
    toast({
      title: "Success",
      description: "Artist added successfully!",
    });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card className="bg-white/10 backdrop-blur-md border-white/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Music className="h-5 w-5" />
            Add Artist
          </CardTitle>
          <CardDescription className="text-white/70">
            Add a new artist to the festival lineup
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            onClick={() => setAddArtistOpen(true)}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white"
          >
            <Music className="h-4 w-4 mr-2" />
            Add New Artist
          </Button>
        </CardContent>
      </Card>

      <Card className="bg-white/10 backdrop-blur-md border-white/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Tag className="h-5 w-5" />
            Add Genre
          </CardTitle>
          <CardDescription className="text-white/70">
            Add a new music genre for categorization
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            onClick={() => setAddGenreOpen(true)}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white"
          >
            <Tag className="h-4 w-4 mr-2" />
            Add New Genre
          </Button>
        </CardContent>
      </Card>

      <AddArtistDialog
        open={addArtistOpen}
        onOpenChange={setAddArtistOpen}
        onSuccess={handleArtistAdded}
      />

      <AddGenreDialog open={addGenreOpen} onOpenChange={setAddGenreOpen} />
    </div>
  );
}
