import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { GenreMultiSelect } from "./GenreMultiSelect";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useUserPermissionsQuery } from "@/hooks/queries/auth/useUserPermissions";
import { useGenresQuery } from "@/hooks/queries/genres/useGenres";
import { Artist } from "@/hooks/queries/artists/useArtists";
import { useUpdateArtistMutation } from "@/hooks/queries/artists/useUpdateArtist";

// Form validation schema
const editArtistFormSchema = z.object({
  name: z.string().min(1, "Artist name is required"),
  description: z.string().optional(),
  genre_ids: z.array(z.string()).optional(),
  spotify_url: z.string().url().optional().or(z.literal("")),
  soundcloud_url: z.string().url().optional().or(z.literal("")),
  image_url: z.string().url().optional().or(z.literal("")),
});

type EditArtistFormData = z.infer<typeof editArtistFormSchema>;

interface EditArtistDialogProps {
  artist: Artist;
  onClose?: () => void;
}

export function EditArtistDialog({ artist, onClose }: EditArtistDialogProps) {
  const { user, loading: authLoading } = useAuth();
  const { data: canEdit = false, isLoading: isLoadingPermissions } =
    useUserPermissionsQuery(user?.id, "edit_artists");

  const { toast } = useToast();

  // React Query hooks
  const { data: genres = [], isLoading: isLoadingGenres } = useGenresQuery();
  const updateArtistMutation = useUpdateArtistMutation();

  // Form setup
  const form = useForm<EditArtistFormData>({
    resolver: zodResolver(editArtistFormSchema),
    defaultValues: {
      name: artist.name,
      description: artist.description || "",
      genre_ids: artist.artist_music_genres?.map((g) => g.music_genre_id) || [],
      spotify_url: artist.spotify_url || "",
      soundcloud_url: artist.soundcloud_url || "",
      image_url: artist.image_url || "",
    },
  });

  if (authLoading || isLoadingPermissions) {
    return null;
  }

  async function onSubmit(data: EditArtistFormData) {
    // Check Core team permissions
    if (!canEdit) {
      toast({
        title: "Permission Denied",
        description: "Only Core team members can edit artists",
        variant: "destructive",
      });
      return;
    }

    updateArtistMutation.mutate(
      {
        id: artist.id,
        updates: {
          name: data.name,
          description: data.description || null,
          genre_ids: data.genre_ids,
          spotify_url: data.spotify_url || null,
          soundcloud_url: data.soundcloud_url || null,
          image_url: data.image_url || null,
        },
      },
      {
        onSuccess() {
          onClose?.();
        },
      },
    );
  }

  return (
    <Dialog open onOpenChange={() => onClose?.()}>
      <DialogContent className="sm:max-w-[425px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Artist</DialogTitle>
          <DialogDescription>
            Update artist information, genres, streaming links, and performance
            details.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Artist Name *</FormLabel>
                  <FormControl>
                    <Input {...field} />
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
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Tell us about this artist..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="image_url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Image URL</FormLabel>
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

            <FormField
              control={form.control}
              name="spotify_url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Spotify URL</FormLabel>
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
              name="soundcloud_url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>SoundCloud URL</FormLabel>
                  <FormControl>
                    <Input
                      type="url"
                      placeholder="https://soundcloud.com/artist"
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
              disabled={updateArtistMutation.isPending || isLoadingGenres}
            >
              {updateArtistMutation.isPending ? "Updating..." : "Update Artist"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
