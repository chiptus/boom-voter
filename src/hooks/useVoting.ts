import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

export const useVoting = (user: any, onVoteUpdate?: () => void) => {
  const [userVotes, setUserVotes] = useState<Record<string, number>>({});
  const [votingLoading, setVotingLoading] = useState<Record<string, boolean>>({});
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      fetchUserVotes(user.id);
    } else {
      setUserVotes({});
    }
  }, [user]);

  const fetchUserVotes = async (userId: string) => {
    const { data, error } = await supabase
      .from("votes")
      .select("artist_id, vote_type")
      .eq("user_id", userId);

    if (!error && data) {
      const votesMap = data.reduce((acc, vote) => {
        acc[vote.artist_id] = vote.vote_type;
        return acc;
      }, {} as Record<string, number>);
      setUserVotes(votesMap);
    }
  };

  const handleVote = async (artistId: string, voteType: number) => {
    if (!user) {
      return { requiresAuth: true };
    }

    if (votingLoading[artistId]) {
      return { requiresAuth: false };
    }

    setVotingLoading(prev => ({ ...prev, [artistId]: true }));

    try {
      const existingVote = userVotes[artistId];
      
      if (existingVote === voteType) {
        // Remove vote if clicking the same vote type
        const { error } = await supabase
          .from("votes")
          .delete()
          .eq("user_id", user.id)
          .eq("artist_id", artistId);

        if (error) {
          toast({
            title: "Error",
            description: "Failed to remove vote. Please try again.",
            variant: "destructive",
          });
        } else {
          setUserVotes(prev => {
            const newVotes = { ...prev };
            delete newVotes[artistId];
            return newVotes;
          });
          onVoteUpdate?.();
        }
      } else {
        // Add or update vote
        const { error } = await supabase
          .from("votes")
          .upsert({
            user_id: user.id,
            artist_id: artistId,
            vote_type: voteType,
          }, {
            onConflict: 'user_id,artist_id'
          });

        if (error) {
          toast({
            title: "Error",
            description: "Failed to save vote. Please try again.",
            variant: "destructive",
          });
        } else {
          setUserVotes(prev => ({ ...prev, [artistId]: voteType }));
          onVoteUpdate?.();
        }
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setVotingLoading(prev => ({ ...prev, [artistId]: false }));
    }

    return { requiresAuth: false };
  };

  return {
    userVotes,
    votingLoading,
    handleVote,
  };
};