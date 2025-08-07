import { useState, useCallback, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { offlineStorage } from "@/lib/offlineStorage";
import { useOnlineStatus, useOfflineQueue } from "./useOffline";
import { User } from "@supabase/supabase-js";

export const useOfflineVoting = (
  user: User | null,
  onVoteUpdate?: () => void,
) => {
  const [userVotes, setUserVotes] = useState<Record<string, number>>({});
  const [votingLoading, setVotingLoading] = useState<Record<string, boolean>>(
    {},
  );
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

  const loadUserVotes = useCallback(
    async (userId: string) => {
      try {
        // Load from offline storage first
        const offlineVotes = await offlineStorage.getVotes();
        const userOfflineVotes = offlineVotes.filter(
          (vote) => vote.userId === userId,
        );

        // Create votes map from offline data
        const offlineVotesMap = userOfflineVotes.reduce(
          (acc, vote) => {
            const id = vote.setId;
            if (id) {
              acc[id] = vote.voteType;
            }
            return acc;
          },
          {} as Record<string, number>,
        );

        setUserVotes(offlineVotesMap);

        // If online, also fetch from server and merge
        if (isOnline) {
          try {
            const { data, error } = await supabase
              .from("votes")
              .select("set_id, vote_type")
              .eq("user_id", userId)
              .not("set_id", "is", null);

            if (!error && data) {
              const serverVotesMap = data.reduce(
                (acc, vote) => {
                  if (vote.set_id) {
                    acc[vote.set_id] = vote.vote_type;
                  }
                  return acc;
                },
                {} as Record<string, number>,
              );

              // Merge offline and server votes (offline takes precedence for conflicts)
              setUserVotes({ ...serverVotesMap, ...offlineVotesMap });
            }
          } catch (error) {
            console.error("Error fetching server votes:", error);
          }
        }
      } catch (error) {
        console.error("Error loading user votes:", error);
      }
    },
    [isOnline],
  );

  const handleVote = useCallback(
    async (setId: string, voteType: number) => {
      if (!user) {
        return { requiresAuth: true };
      }

      if (votingLoading[setId]) {
        return { requiresAuth: false };
      }

      setVotingLoading((prev) => ({ ...prev, [setId]: true }));

      try {
        const existingVote = userVotes[setId];

        if (existingVote === voteType) {
          // Remove vote
          const offlineVotes = await offlineStorage.getVotes(setId);
          const userVote = offlineVotes.find((vote) => vote.userId === user.id);

          if (userVote) {
            await offlineStorage.deleteVote(userVote.id);
          }

          // Update local state
          setUserVotes((prev) => {
            const newVotes = { ...prev };
            delete newVotes[setId];
            return newVotes;
          });

          // If online, sync to server immediately
          if (isOnline) {
            try {
              await supabase
                .from("votes")
                .delete()
                .eq("user_id", user.id)
                .eq("artist_id", setId);
            } catch (error) {
              console.error("Error removing vote from server:", error);
            }
          }

          toast({
            title: "Vote removed",
            description: isOnline
              ? "Vote removed successfully"
              : "Vote removed (will sync when online)",
          });
        } else {
          // Add or update vote
          await offlineStorage.saveVote({
            setId,
            voteType,
            userId: user.id,
            timestamp: Date.now(),
            synced: false,
          });

          // Update local state
          setUserVotes((prev) => ({ ...prev, [setId]: voteType }));

          // If online, sync to server immediately
          if (isOnline) {
            try {
              await supabase.from("votes").upsert(
                {
                  user_id: user.id,
                  artist_id: setId, // Using artist_id to store set_id for now
                  set_id: setId,
                  vote_type: voteType,
                },
                {
                  onConflict: "user_id,artist_id",
                },
              );
            } catch (error) {
              console.error("Error syncing vote to server:", error);
            }
          }

          toast({
            title: "Vote saved",
            description: isOnline
              ? "Vote saved successfully"
              : "Vote saved (will sync when online)",
          });
        }

        await updateQueueSize();
        onVoteUpdate?.();
      } catch (error) {
        console.error("Error handling vote:", error);
        toast({
          title: "Error",
          description: "Failed to save vote. Please try again.",
          variant: "destructive",
        });
      } finally {
        setVotingLoading((prev) => ({ ...prev, [setId]: false }));
      }

      return { requiresAuth: false };
    },
    [
      user,
      userVotes,
      votingLoading,
      isOnline,
      toast,
      updateQueueSize,
      onVoteUpdate,
    ],
  );

  return {
    userVotes,
    votingLoading,
    handleVote,
    isOffline: !isOnline,
  };
};
