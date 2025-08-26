import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Music } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useUserPermissionsQuery } from "@/hooks/queries/auth/useUserPermissions";
import { useGenresQuery } from "@/hooks/queries/genres/useGenres";
import { useCreateArtistMutation } from "@/hooks/queries/artists/useCreateArtist";
import { GenreMultiSelect } from "./GenreMultiSelect";

// Form validation schema
const artistFormSchema = z.object({
  name: z.string().min(1, "Artist name is required"),
  description: z.string().optional(),
  genre_ids: z.array(z.string()).optional(),
  spotifyUrl: z.string().url().optional().or(z.literal("")),
  soundcloudUrl: z.string().url().optional().or(z.literal("")),
  imageUrl: z.string().url().optional().or(z.literal("")),
});

type ArtistFormData = z.infer<typeof artistFormSchema>;

interface AddArtistDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function AddArtistDialog({
  open,
  onOpenChange,
  onSuccess,
}: AddArtistDialogProps) {
  const { user, loading: authLoading } = useAuth();
  const { data: canEdit = false, isLoading: isLoadingPermissions } =
    useUserPermissionsQuery(user?.id, "edit_artists");

  const { toast } = useToast();

  // React Query hooks
  const { data: genres = [], isLoading: isLoadingGenres } = useGenresQuery();
  const createArtistMutation = useCreateArtistMutation();

  // Form setup
  const form = useForm<ArtistFormData>({
    resolver: zodResolver(artistFormSchema),
    defaultValues: {
      name: "",
      description: "",
      genre_ids: [],
      spotifyUrl: "",
      soundcloudUrl: "",
      imageUrl: "",
    },
  });

  if (authLoading || isLoadingPermissions) {
    return null;
  }

  async function onSubmit(data: ArtistFormData) {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to add an artist",
        variant: "destructive",
      });
      return;
    }

    // Check Core team permissions
    if (!canEdit) {
      toast({
        title: "Permission Denied",
        description: "Only Core team members can add artists",
        variant: "destructive",
      });
      return;
    }

    createArtistMutation.mutate(
      {
        name: data.name,
        description: data.description || "",
        genre_ids: data.genre_ids || [],
        added_by: user.id,
        spotify_url: data.spotifyUrl || null,
        soundcloud_url: data.soundcloudUrl || null,
        image_url: data.imageUrl || null,
      },
      {
        onSuccess() {
          form.reset();
          onSuccess();
        },
      },
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Music className="h-5 w-5" />
            Add New Artist
          </DialogTitle>
          <DialogDescription>
            Add an artist to the Boom Festival voting list.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Artist Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter artist name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="genre_ids"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Genres</FormLabel>
                  <FormControl>
                    <GenreMultiSelect
                      genres={genres}
                      value={field.value || []}
                      onValueChange={field.onChange}
                      placeholder={
                        isLoadingGenres
                          ? "Loading genres..."
                          : "Select genres..."
                      }
                      disabled={isLoadingGenres}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Tell us about this artist..."
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="spotifyUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Spotify URL (Optional)</FormLabel>
                  <FormControl>
                    <Input
                      type="url"
                      placeholder="https://open.spotify.com/artist/..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="soundcloudUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>SoundCloud URL (Optional)</FormLabel>
                  <FormControl>
                    <Input
                      type="url"
                      placeholder="https://soundcloud.com/..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="imageUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Image URL (Optional)</FormLabel>
                  <FormControl>
                    <Input
                      type="url"
                      placeholder="https://example.com/image.jpg"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full"
              disabled={createArtistMutation.isPending || isLoadingGenres}
            >
              {createArtistMutation.isPending
                ? "Adding artist..."
                : "Add Artist"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
