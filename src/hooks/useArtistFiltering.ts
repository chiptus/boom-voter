
import { useEffect, useState, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Artist } from "./useArtistData";
import type { FilterSortState } from "./useUrlState";

export const useArtistFiltering = (artists: Artist[], filterSortState?: FilterSortState) => {
  const [groupMemberIds, setGroupMemberIds] = useState<string[]>([]);

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

    let filtered = artists.map(artist => {
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
          if (!a.estimated_date && !b.estimated_date) {
            primarySort = 0;
            break;
          }
          if (!a.estimated_date) return 1;
          if (!b.estimated_date) return -1;
          primarySort = new Date(a.estimated_date).getTime() - new Date(b.estimated_date).getTime();
          break;
        default:
          primarySort = 0;
      }
      
      // If primary sort values are equal, sort alphabetically
      return primarySort !== 0 ? primarySort : a.name.localeCompare(b.name);
    });

    return filtered;
  }, [artists, filterSortState, groupMemberIds]);

  return {
    filteredAndSortedArtists,
  };
};
