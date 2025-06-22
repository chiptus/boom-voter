import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import type { Database } from "@/integrations/supabase/types";

type Artist = Database["public"]["Tables"]["artists"]["Row"] & {
  music_genres: { name: string } | null;
  votes: { vote_type: number; user_id: string }[];
};

export const useArtistData = () => {
  const [artists, setArtists] = useState<Artist[]>([]);
  const { toast } = useToast();

  const fetchArtists = async () => {
    console.log('Fetching artists...');
    let query = supabase
      .from("artists")
      .select(`
        *,
        music_genres (name),
        votes (vote_type, user_id)
      `)
      .order("created_at", { ascending: false });

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching artists:', error);
      toast({
        title: "Error",
        description: "Failed to fetch artists",
        variant: "destructive",
      });
    } else {
      console.log('Fetched artists:', data?.length || 0);
      setArtists(data || []);
    }
  };

  useEffect(() => {
    fetchArtists();
    
    // Listen for real-time updates to artists
    const artistsChannel = supabase
      .channel('artists-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'artists' }, () => {
        fetchArtists();
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'votes' }, () => {
        fetchArtists();
      })
      .subscribe();

    return () => {
      artistsChannel.unsubscribe();
    };
  }, []);

  const deleteArtist = async (artistId: string) => {
    console.log('Deleting artist:', artistId);
    const { error } = await supabase
      .from("artists")
      .delete()
      .eq("id", artistId);

    if (error) {
      console.error('Error deleting artist:', error);
      toast({
        title: "Error",
        description: "Failed to delete artist",
        variant: "destructive",
      });
      throw error;
    } else {
      console.log('Artist deleted successfully');
      toast({
        title: "Success",
        description: "Artist deleted successfully",
      });
      // Refresh the artists list
      fetchArtists();
    }
  };

  return {
    artists,
    fetchArtists,
    deleteArtist,
  };
};

export type { Artist };