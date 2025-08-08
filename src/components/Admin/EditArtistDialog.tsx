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
import { GenreMultiSelect } from "@/components/GenreMultiSelect";
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
import { useUserPermissionsQuery } from "@/hooks/queries/useGroupsQuery";
import { useGenresQuery } from "@/hooks/queries/useGenresQuery";
import { useUpdateArtistMutation } from "@/hooks/queries/useArtistsQuery";
import { StageSelector } from "../StageSelector";
import { toDatetimeLocal, toISOString } from "@/lib/timeUtils";
import type { Database } from "@/integrations/supabase/types";

type Artist = Database["public"]["Tables"]["artists"]["Row"] & {
  artist_music_genres: { music_genre_id: string }[] | null;
  votes: { vote_type: number; user_id: string }[];
};

// Form validation schema
const editArtistFormSchema = z.object({
  name: z.string().min(1, "Artist name is required"),
  description: z.string().optional(),
  genre_ids: z.array(z.string()).optional(),
  spotify_url: z.string().url().optional().or(z.literal("")),
  soundcloud_url: z.string().url().optional().or(z.literal("")),
  image_url: z.string().url().optional().or(z.literal("")),
  stage: z.string().optional(),
  time_start: z.string().optional(),
  time_end: z.string().optional(),
});

type EditArtistFormData = z.infer<typeof editArtistFormSchema>;

// Helper function to subtract one hour from datetime-local string
const subtractOneHour = (datetimeLocal: string): string => {
  if (!datetimeLocal) return "";
  const date = new Date(datetimeLocal);
  date.setHours(date.getHours() - 1);

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${year}-${month}-${day}T${hours}:${minutes}`;
};

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
      stage: artist.stage || "",
      time_start: toDatetimeLocal(artist.time_start),
      time_end: toDatetimeLocal(artist.time_end),
      spotify_url: artist.spotify_url || "",
      soundcloud_url: artist.soundcloud_url || "",
      image_url: artist.image_url || "",
    },
  });

  if (authLoading || isLoadingPermissions) {
    return null;
  }

  const onSubmit = async (data: EditArtistFormData) => {
    // Check Core team permissions
    if (!canEdit) {
      toast({
        title: "Permission Denied",
        description: "Only Core team members can edit artists",
        variant: "destructive",
      });
      return;
    }

    try {
      await updateArtistMutation.mutateAsync({
        id: artist.id,
        updates: {
          name: data.name,
          description: data.description || null,
          genre_ids: data.genre_ids,
          stage: data.stage || null,
          time_start: data.time_start ? toISOString(data.time_start) : null,
          time_end: data.time_end ? toISOString(data.time_end) : null,
          spotify_url: data.spotify_url || null,
          soundcloud_url: data.soundcloud_url || null,
          image_url: data.image_url || null,
        },
      });

      onClose?.();
    } catch (error) {
      // Error handling is done in the mutation hook
    }
  };

  const handleSubtractOneHour = () => {
    const currentTimeStart = form.getValues("time_start");
    const currentTimeEnd = form.getValues("time_end");

    if (currentTimeStart || currentTimeEnd) {
      form.setValue(
        "time_start",
        currentTimeStart ? subtractOneHour(currentTimeStart) : "",
      );
      form.setValue(
        "time_end",
        currentTimeEnd ? subtractOneHour(currentTimeEnd) : "",
      );
    }
  };

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
              name="stage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Stage (Optional)</FormLabel>
                  <FormControl>
                    <StageSelector
                      value={field.value || ""}
                      onValueChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="time_start"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Performance Start Time</FormLabel>
                  <FormControl>
                    <Input type="datetime-local" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-center">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleSubtractOneHour}
                disabled={
                  !form.getValues("time_start") && !form.getValues("time_end")
                }
              >
                -1 Hour
              </Button>
            </div>

            <FormField
              control={form.control}
              name="time_end"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Performance End Time</FormLabel>
                  <FormControl>
                    <Input type="datetime-local" {...field} />
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
