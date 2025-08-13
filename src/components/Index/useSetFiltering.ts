import { useEffect, useState, useMemo, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { FestivalSet } from "@/services/queries";
import type { FilterSortState } from "../../hooks/useUrlState";
import { useStagesQuery } from "@/hooks/queries/stages/useStages";

export const useSetFiltering = (
  sets: FestivalSet[],
  filterSortState?: FilterSortState,
) => {
  const [groupMemberIds, setGroupMemberIds] = useState<string[]>([]);
  const { data: _stages = [] } = useStagesQuery();
  const [lockedOrder, setLockedOrder] = useState<FestivalSet[]>([]);

  useEffect(() => {
    const fetchGroupMembers = async () => {
      if (!filterSortState?.groupId) {
        setGroupMemberIds([]);
        return;
      }

      const { data, error } = await supabase
        .from("group_members")
        .select("user_id")
        .eq("group_id", filterSortState.groupId);

      if (!error && data) {
        setGroupMemberIds(data.map((member) => member.user_id));
      }
    };

    fetchGroupMembers();
  }, [filterSortState?.groupId]);

  // Calculate rating for a set based on vote weights
  const calculateRating = (set: FestivalSet): number => {
    if (!set.votes || set.votes.length === 0) return 0;

    const totalScore = set.votes.reduce((sum, vote) => {
      // Use the actual vote type values: 2 (Must go), 1 (Interested), -1 (Won't go)
      return sum + vote.vote_type;
    }, 0);

    return totalScore / set.votes.length;
  };

  // Get weighted popularity score: 2 * (must go votes) + interested votes
  const getWeightedPopularityScore = (set: FestivalSet): number => {
    if (!set.votes) return 0;
    const mustGoVotes = set.votes.filter((vote) => vote.vote_type === 2).length;
    const interestedVotes = set.votes.filter(
      (vote) => vote.vote_type === 1,
    ).length;

    return 2 * mustGoVotes + interestedVotes;
  };

  // Filter and sort sets based on current state
  const filteredAndSortedSets = useMemo(() => {
    if (!filterSortState) return sets;

    const filtered = sets
      .map((set) => {
        // Filter votes by group if groupId is selected
        let filteredVotes = set.votes || [];
        if (filterSortState.groupId && groupMemberIds.length > 0) {
          filteredVotes = filteredVotes.filter((vote) =>
            groupMemberIds.includes(vote.user_id),
          );
        }

        return {
          ...set,
          votes: filteredVotes,
        };
      })
      .filter((set) => {
        // Stage filter - use set's stage_id directly
        if (filterSortState.stages.length > 0 && set.stage_id) {
          if (!filterSortState.stages.includes(set.stage_id)) return false;
        }

        // Genre filter - check all artists' genres
        if (
          filterSortState.genres.length > 0 &&
          set.artists &&
          set.artists.length > 0
        ) {
          const hasMatchingGenre = set.artists.some((artist) =>
            artist.artist_music_genres?.some((genre) =>
              filterSortState.genres.includes(genre.music_genre_id),
            ),
          );
          if (!hasMatchingGenre) return false;
        }

        // Rating filter
        if (filterSortState.minRating > 0) {
          const rating = calculateRating(set);
          if (rating < filterSortState.minRating) return false;
        }

        return true;
      });

    // Sort sets
    filtered.sort((a, b) => {
      let primarySort = 0;

      switch (filterSortState.sort) {
        case "name-asc":
          return a.name.localeCompare(b.name);
        case "name-desc":
          return b.name.localeCompare(a.name);
        case "rating-desc":
          primarySort = calculateRating(b) - calculateRating(a);
          break;
        case "popularity-desc":
          primarySort =
            getWeightedPopularityScore(b) - getWeightedPopularityScore(a);
          break;
        case "date-asc":
          if (!a.time_start && !b.time_start) {
            primarySort = 0;
            break;
          }
          if (!a.time_start) return 1;
          if (!b.time_start) return -1;
          primarySort =
            new Date(a.time_start).getTime() - new Date(b.time_start).getTime();
          break;
        default:
          primarySort = 0;
      }

      // If primary sort values are equal, sort alphabetically
      return primarySort !== 0 ? primarySort : a.name.localeCompare(b.name);
    });

    // If sort is locked, use the locked order but with updated vote data
    if (filterSortState.sortLocked && lockedOrder.length > 0) {
      // Update the locked order with fresh data while preserving positions
      const updatedLockedOrder = lockedOrder.map((lockedSet) => {
        const freshSet = filtered.find((f) => f.id === lockedSet.id);
        return freshSet || lockedSet;
      });
      // Add any new sets that weren't in the locked order
      const newSets = filtered.filter(
        (f) => !lockedOrder.some((l) => l.id === f.id),
      );
      return [...updatedLockedOrder, ...newSets];
    }

    return filtered;
  }, [sets, filterSortState, groupMemberIds, lockedOrder]);

  // Update locked order when sort is unlocked
  useEffect(() => {
    if (!filterSortState?.sortLocked) {
      setLockedOrder([]);
    }
  }, [filterSortState?.sortLocked]);

  // Function to lock the current order and update URL state
  const lockCurrentOrder = useCallback(
    (updateUrlState: (state: Partial<FilterSortState>) => void) => {
      setLockedOrder([...filteredAndSortedSets]);
      updateUrlState({ sortLocked: true });
    },
    [filteredAndSortedSets],
  );

  return {
    filteredAndSortedSets,
    lockCurrentOrder,
  };
};
