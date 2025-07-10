
import { useEffect, useState, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Artist } from "@/hooks/useOfflineArtistData";
import type { FilterSortState } from "../../hooks/useUrlState";
import { STAGES } from "./filters/constants";

export const useArtistFiltering = (artists: Artist[], filterSortState?: FilterSortState) => {
  const [groupMemberIds, setGroupMemberIds] = useState<string[]>([]);
  const [lockedOrder, setLockedOrder] = useState<Artist[]>([]);

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
        setGroupMemberIds(data.map(member => member.user_id));
      }
    };

    fetchGroupMembers();
  }, [filterSortState?.groupId]);

  // Calculate rating for an artist based on vote weights
  const calculateRating = (artist: Artist): number => {
    if (artist.votes.length === 0) return 0;
    
    const totalScore = artist.votes.reduce((sum, vote) => {
      // Use the actual vote type values: 2 (Must go), 1 (Interested), -1 (Won't go)
      return sum + vote.vote_type;
    }, 0);
    
    return totalScore / artist.votes.length;
  };

  // Get weighted popularity score: 2 * (must go votes) + interested votes
  const getWeightedPopularityScore = (artist: Artist): number => {
    const mustGoVotes = artist.votes.filter(vote => vote.vote_type === 2).length;
    const interestedVotes = artist.votes.filter(vote => vote.vote_type === 1).length;
    
    return (2 * mustGoVotes) + interestedVotes;
  };

  // Filter and sort artists based on current state
  const filteredAndSortedArtists = useMemo(() => {
    if (!filterSortState) return artists;

    const filtered = artists.map(artist => {
      // Filter votes by group if groupId is selected
      let filteredVotes = artist.votes;
      if (filterSortState.groupId && groupMemberIds.length > 0) {
        filteredVotes = artist.votes.filter(vote => groupMemberIds.includes(vote.user_id));
      }

      return {
        ...artist,
        votes: filteredVotes,
      };
    }).filter(artist => {
      // if (!artist.stage || !STAGES.includes(artist.stage)){ return true;}
      // return false;

      // Stage filter
      if (filterSortState.stages.length > 0 && artist.stage) {
        if (!filterSortState.stages.includes(artist.stage)) return false;
      }

      
      // Genre filter
      if (filterSortState.genres.length > 0 && artist.music_genres) {
        if (!filterSortState.genres.includes(artist.genre_id)) return false;
      }

      // Rating filter
      if (filterSortState.minRating > 0) {
        const rating = calculateRating(artist);
        if (rating < filterSortState.minRating) return false;
      }

      return true;
    });

    // Sort artists
    filtered.sort((a, b) => {
      let primarySort = 0;
      
      switch (filterSortState.sort) {
        case 'name-asc':
          return a.name.localeCompare(b.name);
        case 'name-desc':
          return b.name.localeCompare(a.name);
        case 'rating-desc':
          primarySort = calculateRating(b) - calculateRating(a);
          break;
        case 'popularity-desc':
          primarySort = getWeightedPopularityScore(b) - getWeightedPopularityScore(a);
          break;
        case 'date-asc':
          if (!a.time_start && !b.time_start) {
            primarySort = 0;
            break;
          }
          if (!a.time_start) return 1;
          if (!b.time_start) return -1;
          primarySort = new Date(a.time_start).getTime() - new Date(b.time_start).getTime();
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
      const updatedLockedOrder = lockedOrder.map(lockedArtist => {
        const freshArtist = filtered.find(f => f.id === lockedArtist.id);
        return freshArtist || lockedArtist;
      });
      // Add any new artists that weren't in the locked order
      const newArtists = filtered.filter(f => !lockedOrder.some(l => l.id === f.id));
      return [...updatedLockedOrder, ...newArtists];
    }

    return filtered;
  }, [artists, filterSortState, groupMemberIds]);

  // Manage locked order snapshot separately to avoid circular dependency
  useEffect(() => {
    if (!filterSortState?.sortLocked) {
      // When sort is not locked, update the locked order with current results
      const filtered = artists.map(artist => {
        let filteredVotes = artist.votes;
        if (filterSortState?.groupId && groupMemberIds.length > 0) {
          filteredVotes = artist.votes.filter(vote => groupMemberIds.includes(vote.user_id));
        }
        return { ...artist, votes: filteredVotes };
      }).filter(artist => {
        if (filterSortState?.stages.length > 0 && artist.stage) {
          if (!filterSortState.stages.includes(artist.stage)) return false;
        }
        if (filterSortState?.genres.length > 0 && artist.music_genres) {
          if (!filterSortState.genres.includes(artist.genre_id)) return false;
        }
        if (filterSortState?.minRating > 0) {
          const rating = calculateRating(artist);
          if (rating < filterSortState.minRating) return false;
        }
        return true;
      });

      // Apply sorting
      filtered.sort((a, b) => {
        let primarySort = 0;
        switch (filterSortState?.sort) {
          case 'name-asc':
            return a.name.localeCompare(b.name);
          case 'name-desc':
            return b.name.localeCompare(a.name);
          case 'rating-desc':
            primarySort = calculateRating(b) - calculateRating(a);
            break;
          case 'popularity-desc':
            primarySort = getWeightedPopularityScore(b) - getWeightedPopularityScore(a);
            break;
          case 'date-asc':
            if (!a.time_start && !b.time_start) {
              primarySort = 0;
              break;
            }
            if (!a.time_start) return 1;
            if (!b.time_start) return -1;
            primarySort = new Date(a.time_start).getTime() - new Date(b.time_start).getTime();
            break;
          default:
            primarySort = 0;
        }
        return primarySort !== 0 ? primarySort : a.name.localeCompare(b.name);
      });

      setLockedOrder(filtered);
    }
  }, [artists, filterSortState, groupMemberIds]);

  return {
    filteredAndSortedArtists,
  };
};
