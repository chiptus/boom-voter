import { useEffect, useState, useMemo, startTransition } from "react";
import { useGroupMembersQuery } from "./queries/useGroupMembersQuery";
import type { Artist } from "./useArtistData";
import type { FilterSortState } from "./useUrlState";

export const useOptimizedArtistFiltering = (artists: Artist[], filterSortState?: FilterSortState) => {
  const [filteredArtists, setFilteredArtists] = useState<Artist[]>(artists);
  const [isFiltering, setIsFiltering] = useState(false);
  
  // Use cached group members query
  const { data: groupMemberIds = [] } = useGroupMembersQuery(filterSortState?.groupId);

  // Calculate rating for an artist based on vote weights
  const calculateRating = (artist: Artist): number => {
    if (artist.votes.length === 0) return 0;
    
    const totalScore = artist.votes.reduce((sum, vote) => {
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

  // Immediate basic filtering for fast initial render
  const basicFilteredArtists = useMemo(() => {
    if (!filterSortState) return artists;

    return artists.map(artist => {
      // Filter votes by group if groupId is selected
      let filteredVotes = artist.votes;
      if (filterSortState.groupId && groupMemberIds.length > 0) {
        filteredVotes = artist.votes.filter(vote => groupMemberIds.includes(vote.user_id));
      }

      return {
        ...artist,
        votes: filteredVotes,
      };
    });
  }, [artists, filterSortState?.groupId, groupMemberIds]);

  // Debounced filtering and sorting using startTransition
  useEffect(() => {
    if (!filterSortState) {
      setFilteredArtists(artists);
      return;
    }

    setIsFiltering(true);

    const timeoutId = setTimeout(() => {
      startTransition(() => {
        let filtered = basicFilteredArtists.filter(artist => {
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

        setFilteredArtists(filtered);
        setIsFiltering(false);
      });
    }, 100); // Debounce for 100ms

    return () => {
      clearTimeout(timeoutId);
      setIsFiltering(false);
    };
  }, [basicFilteredArtists, filterSortState, calculateRating, getWeightedPopularityScore]);

  return {
    filteredAndSortedArtists: filteredArtists,
    isFiltering,
  };
};