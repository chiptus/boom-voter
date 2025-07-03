import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useGroups } from "@/hooks/useGroups";
import { useAuth } from "@/hooks/useAuth";
import { Artist, useOfflineArtistData } from "@/hooks/useOfflineArtistData";
import { useOfflineVoting } from "@/hooks/useOfflineVoting";
import { offlineStorage } from "@/lib/offlineStorage";

export const useArtistDetail = (id: string | undefined) => {
  const [canEdit, setCanEdit] = useState(false);
  const [artist, setArtist] = useState<Artist | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { canEditArtists } = useGroups();
  const { user } = useAuth();
  const { archiveArtist: archiveArtistOffline } = useOfflineArtistData();
  const { userVotes, handleVote } = useOfflineVoting(user);

  useEffect(() => {
    if (user) {
      checkPermissions();
    }
  }, [user]);

  useEffect(() => {
    if (id) {
      loadArtist();
    }
  }, [id]);

  const loadArtist = async () => {
    if (!id) return;
    
    setLoading(true);
    try {
      const artistData = await offlineStorage.getArtist(id);
      setArtist(artistData);
    } catch (error) {
      console.error('Error loading artist:', error);
      toast({
        title: "Error",
        description: "Failed to load artist data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const checkPermissions = async () => {
    const editPermission = await canEditArtists();
    setCanEdit(editPermission);
  };

  const handleVoteAction = async (voteType: number) => {
    if (!id) return;
    await handleVote(id, voteType);
  };

  const getVoteCount = (voteType: number) => {
    if (!artist) return 0;
    return artist.votes.filter((vote) => vote.vote_type === voteType).length;
  };

  const netVoteScore = artist ? getVoteCount(1) - getVoteCount(-1) : 0;

  const archiveArtist = async () => {
    if (!id) return;
    await archiveArtistOffline(id);
  };

  const userVote = userVotes[id || ''] || null;

  return {
    artist,
    user,
    userVote,
    loading,
    canEdit,
    handleVote: handleVoteAction,
    getVoteCount,
    netVoteScore,
    fetchArtist: loadArtist,
    archiveArtist,
  };
};
