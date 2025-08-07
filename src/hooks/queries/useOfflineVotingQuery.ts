import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { offlineStorage } from "@/lib/offlineStorage";
import { useOnlineStatus, useOfflineQueue } from "@/hooks/useOffline";
import { voteQueries } from "@/services/queries";
import type { User } from "@supabase/supabase-js";

interface OfflineVote {
  id: string;
  setId: string;
  voteType: number;
  userId: string;
  timestamp: number;
  synced: boolean;
}

const mergeOfflineAndServerVotes = (
  offlineVotes: OfflineVote[],
  serverVotes: Record<string, number>,
): Record<string, number> => {
  // Start with server votes (authoritative when online)
  const mergedVotes = { ...serverVotes };

  // Add offline votes that aren't on server yet
  offlineVotes.forEach((vote) => {
    const voteId = vote.setId;
    // Only use offline vote if no server vote exists
    if (!(voteId in mergedVotes)) {
      mergedVotes[voteId] = vote.voteType;
    }
  });

  return mergedVotes;
};

const fetchUserVotesWithOffline = async (
  userId: string,
  isOnline: boolean,
): Promise<Record<string, number>> => {
  // Always load offline votes first
  const offlineVotes = await offlineStorage.getVotes();
  const userOfflineVotes = offlineVotes.filter(
    (vote) => vote.userId === userId,
  );

  if (!isOnline) {
    // Transform offline votes to expected format
    return userOfflineVotes.reduce(
      (acc, vote) => {
        acc[vote.setId] = vote.voteType;
        return acc;
      },
      {} as Record<string, number>,
    );
  }

  // Fetch server votes when online
  try {
    const { data, error } = await supabase
      .from("votes")
      .select("set_id, artist_id, vote_type")
      .eq("user_id", userId);

    if (error) {
      console.error("Error fetching server votes:", error);
      // Fall back to offline votes only
      return userOfflineVotes.reduce(
        (acc, vote) => {
          acc[vote.setId] = vote.voteType;
          return acc;
        },
        {} as Record<string, number>,
      );
    }

    const serverVotes: Record<string, number> = {};
    (data || []).forEach((vote) => {
      // Prioritize set-based votes over legacy artist votes
      if (vote.set_id) {
        serverVotes[vote.set_id] = vote.vote_type;
      } else if (vote.artist_id && !serverVotes[vote.artist_id]) {
        serverVotes[vote.artist_id] = vote.vote_type;
      }
    });

    // Merge offline and server votes
    return mergeOfflineAndServerVotes(userOfflineVotes, serverVotes);
  } catch (error) {
    console.error("Error loading user votes:", error);
    // Fall back to offline votes only
    return userOfflineVotes.reduce(
      (acc, vote) => {
        acc[vote.setId] = vote.voteType;
        return acc;
      },
      {} as Record<string, number>,
    );
  }
};

export const useOfflineVotingQuery = (user: User | null) => {
  const isOnline = useOnlineStatus();

  return useQuery({
    queryKey: voteQueries.user(user?.id || ""),
    queryFn: () => fetchUserVotesWithOffline(user!.id, isOnline),
    enabled: !!user?.id,
    staleTime: isOnline ? 30 * 1000 : Infinity, // 30 seconds for online, infinite for offline
    refetchOnWindowFocus: isOnline,
  });
};

export const useOfflineVoteMutation = (
  user: User | null,
  onVoteUpdate?: () => void,
) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const isOnline = useOnlineStatus();
  const { updateQueueSize } = useOfflineQueue();

  return useMutation({
    mutationFn: async ({
      setId,
      voteType,
    }: {
      setId: string;
      voteType: number;
    }) => {
      if (!user) {
        throw new Error("User not authenticated");
      }

      const userId = user.id;

      // Get current vote to determine if this is a toggle
      const currentVotes =
        (queryClient.getQueryData(voteQueries.user(userId)) as Record<
          string,
          number
        >) || {};
      const existingVote = currentVotes[setId];
      const isToggle = existingVote === voteType;

      // Save to offline storage first
      if (isToggle) {
        // Find and remove the existing vote
        const offlineVotes = await offlineStorage.getVotes();
        const existingVote = offlineVotes.find(
          (v) => v.userId === userId && v.setId === setId,
        );
        if (existingVote) {
          await offlineStorage.deleteVote(existingVote.id);
        }
      } else {
        // Add/update vote
        await offlineStorage.saveVote({
          userId,
          setId,
          voteType,
          timestamp: Date.now(),
          synced: false,
        });
      }

      // Update query cache immediately for optimistic updates
      queryClient.setQueryData(
        voteQueries.user(userId),
        (oldData: Record<string, number> = {}) => {
          const newData = { ...oldData };
          if (isToggle) {
            delete newData[setId];
          } else {
            newData[setId] = voteType;
          }
          return newData;
        },
      );

      // If online, sync immediately
      if (isOnline) {
        try {
          if (isToggle) {
            // Remove vote from server
            const { error } = await supabase
              .from("votes")
              .delete()
              .eq("user_id", userId)
              .eq("set_id", setId);

            if (error) throw error;
          } else {
            // Add/update vote on server
            const { error } = await supabase.from("votes").upsert(
              {
                artist_id: "",
                user_id: userId,
                vote_type: voteType,
                set_id: setId,
              },
              {
                onConflict: "user_id,set_id",
              },
            );

            if (error) throw error;
          }

          // Mark as synced in offline storage
          if (!isToggle) {
            // Find and mark the vote as synced
            const offlineVotes = await offlineStorage.getVotes();
            const voteToSync = offlineVotes.find(
              (v) => v.userId === userId && v.setId === setId,
            );
            if (voteToSync) {
              await offlineStorage.markVoteSynced(voteToSync.id);
            }
          }
        } catch (error) {
          console.error("Error syncing vote to server:", error);
          // Keep in offline storage for later sync
          updateQueueSize();
          throw error;
        }
      } else {
        // Offline mode - add to queue
        updateQueueSize();
      }

      // Trigger callback if provided
      if (onVoteUpdate) {
        onVoteUpdate();
      }

      return isToggle ? null : voteType;
    },
    onError: (error: Error) => {
      // Revert optimistic update on error
      if (user?.id) {
        queryClient.invalidateQueries({
          queryKey: voteQueries.user(user.id),
        });
      }

      toast({
        title: "Error",
        description: error.message || "Failed to save vote",
        variant: "destructive",
      });
    },
  });
};
