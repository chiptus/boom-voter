import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import type { Artist } from "@/hooks/useArtists";

interface DeleteArtistDialogProps {
  artist: Artist;
  onDelete: (artistId: string) => Promise<void>;
  trigger?: React.ReactNode;
  loading?: boolean;
}

export const DeleteArtistDialog = ({ artist, onDelete, trigger, loading = false }: DeleteArtistDialogProps) => {
  const [open, setOpen] = useState(false);

  const handleDelete = async () => {
    await onDelete(artist.id);
    setOpen(false);
  };

  const defaultTrigger = (
    <Button variant="outline" size="sm" className="border-red-400 text-red-400 hover:bg-red-400 hover:text-white">
      <Trash className="h-4 w-4" />
    </Button>
  );

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        {trigger || defaultTrigger}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Artist</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete <strong>{artist.name}</strong>? 
            This action cannot be undone and will permanently remove the artist and all associated votes.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={loading}
            className="bg-red-600 hover:bg-red-700"
          >
            {loading ? "Deleting..." : "Delete Artist"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};