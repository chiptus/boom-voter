import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useGroups } from "@/hooks/useGroups";
import { useAuth } from "@/hooks/useAuth";
import { useArtistQuery } from "./queries/useArtistsQuery";
import { useUserVotesQuery, useVoteMutation } from "./queries/useVotingQuery";
import { useArchiveArtistMutation } from "./queries/useArtistsQuery";

export const useArtistDetail = (id: string | undefined) => {
  const [canEdit, setCanEdit] = useState(false);
  const { toast } = useToast();
  const { canEditArtists } = useGroups();
  const { user } = useAuth();
  
  const { data: artist, isLoading: loading, refetch: fetchArtist } = useArtistQuery(id);
  const { data: userVotes = {} } = useUserVotesQuery(user?.id);
  const voteMutation = useVoteMutation();
  const archiveArtistMutation = useArchiveArtistMutation();

  const userVote = userVotes[id || ''] || null;

  useEffect(() => {
    if (user) {
      checkPermissions();
    }
  }, [user]);

  const checkPermissions = async () => {
    const editPermission = await canEditArtists();
    setCanEdit(editPermission);
  };

  const handleVote = async (voteType: number) => {
    if (!user || !id) {
      toast({
        title: "Authentication required",
        description: "Please sign in to vote",
        variant: "destructive",
      });
      return;
    }

    try {
      await voteMutation.mutateAsync({
        artistId: id,
        voteType,
        userId: user.id,
        existingVote: userVote,
      });
    } catch (error) {
      // Error handling is done in the mutation
    }
  };

  const getVoteCount = (voteType: number) => {
    if (!artist) return 0;
    return artist.votes.filter(vote => vote.vote_type === voteType).length;
  };

  const netVoteScore = artist ? getVoteCount(1) - getVoteCount(-1) : 0;

  const archiveArtist = async () => {
    if (!id) return;
    
    try {
      await archiveArtistMutation.mutateAsync(id);
    } catch (error) {
      // Error handling is done in the mutation
      throw error;
    }
  };

  return {
    artist,
    user,
    userVote,
    loading,
    canEdit,
    handleVote,
    getVoteCount,
    netVoteScore,
    fetchArtist,
    archiveArtist,
  };
};