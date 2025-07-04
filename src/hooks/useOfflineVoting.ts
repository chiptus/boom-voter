import { useState, useCallback, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { offlineStorage } from '@/lib/offlineStorage';
import { useOnlineStatus, useOfflineQueue } from './useOffline';

export const useOfflineVoting = (user: any, onVoteUpdate?: () => void) => {
  const [userVotes, setUserVotes] = useState<Record<string, number>>({});
  const [votingLoading, setVotingLoading] = useState<Record<string, boolean>>({});
  const { toast } = useToast();
  const isOnline = useOnlineStatus();
  const { updateQueueSize } = useOfflineQueue();

  useEffect(() => {
    if (user) {
      loadUserVotes(user.id);
    } else {
      setUserVotes({});
    }
  }, [user]);

  const loadUserVotes = useCallback(async (userId: string) => {
    try {
      // Load from offline storage first
      const offlineVotes = await offlineStorage.getVotes();
      const userOfflineVotes = offlineVotes.filter(vote => vote.userId === userId);
      
      // Create votes map from offline data
      const offlineVotesMap = userOfflineVotes.reduce((acc, vote) => {
        acc[vote.artistId] = vote.voteType;
        return acc;
      }, {} as Record<string, number>);

      setUserVotes(offlineVotesMap);

      // If online, also fetch from server and merge
      if (isOnline) {
        try {
          const { data, error } = await supabase
            .from("votes")
            .select("artist_id, vote_type")
            .eq("user_id", userId);

          if (!error && data) {
            const serverVotesMap = data.reduce((acc, vote) => {
              acc[vote.artist_id] = vote.vote_type;
              return acc;
            }, {} as Record<string, number>);

            // Merge offline and server votes (offline takes precedence for conflicts)
            setUserVotes({ ...serverVotesMap, ...offlineVotesMap });
          }
        } catch (error) {
          console.error('Error fetching server votes:', error);
        }
      }
    } catch (error) {
      console.error('Error loading user votes:', error);
    }
  }, [isOnline]);

  const handleVote = useCallback(async (artistId: string, voteType: number) => {
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
        // Remove vote
        const offlineVotes = await offlineStorage.getVotes(artistId);
        const userVote = offlineVotes.find(vote => vote.userId === user.id);
        
        if (userVote) {
          await offlineStorage.deleteVote(userVote.id);
        }

        // Update local state
        setUserVotes(prev => {
          const newVotes = { ...prev };
          delete newVotes[artistId];
          return newVotes;
        });

        // If online, sync to server immediately
        if (isOnline) {
          try {
            await supabase
              .from("votes")
              .delete()
              .eq("user_id", user.id)
              .eq("artist_id", artistId);
          } catch (error) {
            console.error('Error removing vote from server:', error);
          }
        }

        toast({
          title: "Vote removed",
          description: isOnline ? "Vote removed successfully" : "Vote removed (will sync when online)",
        });
      } else {
        // Add or update vote
        await offlineStorage.saveVote({
          artistId,
          voteType,
          userId: user.id,
          timestamp: Date.now(),
          synced: false,
        });

        // Update local state
        setUserVotes(prev => ({ ...prev, [artistId]: voteType }));

        // If online, sync to server immediately
        if (isOnline) {
          try {
            await supabase
              .from("votes")
              .upsert({
                user_id: user.id,
                artist_id: artistId,
                vote_type: voteType,
              }, {
                onConflict: 'user_id,artist_id'
              });
          } catch (error) {
            console.error('Error syncing vote to server:', error);
          }
        }

        toast({
          title: "Vote saved",
          description: isOnline ? "Vote saved successfully" : "Vote saved (will sync when online)",
        });
      }

      await updateQueueSize();
      onVoteUpdate?.();
    } catch (error) {
      console.error('Error handling vote:', error);
      toast({
        title: "Error",
        description: "Failed to save vote. Please try again.",
        variant: "destructive",
      });
    } finally {
      setVotingLoading(prev => ({ ...prev, [artistId]: false }));
    }

    return { requiresAuth: false };
  }, [user, userVotes, votingLoading, isOnline, toast, updateQueueSize, onVoteUpdate]);

  return {
    userVotes,
    votingLoading,
    handleVote,
    isOffline: !isOnline,
  };
};