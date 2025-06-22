import { useMemo } from 'react';
import { useGroups } from './useGroups';
import { useArtists } from './useArtists';

export const useGroupAnalytics = (selectedGroupId?: string) => {
  const { groups, user } = useGroups();
  const { allArtists, userVotes } = useArtists();

  const groupAnalytics = useMemo(() => {
    if (!user || groups.length === 0) return null;

    // Use selected group or default to first group
    const currentGroup = selectedGroupId 
      ? groups.find(g => g.id === selectedGroupId) || groups[0]
      : groups[0];
    
    // Calculate group consensus for each artist
    const artistAnalysis = allArtists.map(artist => {
      const artistVotes = artist.votes || [];
      const groupVotes = artistVotes.filter(vote => vote.vote_type > 0); // Only positive votes
      const mustGoVotes = artistVotes.filter(vote => vote.vote_type === 2).length;
      const interestedVotes = artistVotes.filter(vote => vote.vote_type === 1).length;
      const totalPositiveVotes = mustGoVotes + interestedVotes;
      
      // Calculate consensus score (0-1)
      const consensusScore = totalPositiveVotes > 0 ? mustGoVotes / totalPositiveVotes : 0;
      
      return {
        ...artist,
        mustGoVotes,
        interestedVotes,
        totalPositiveVotes,
        consensusScore,
        isGroupMustSee: mustGoVotes >= Math.max(1, Math.floor(currentGroup.member_count * 0.6)), // 60% threshold
        isControversial: mustGoVotes > 0 && artistVotes.filter(vote => vote.vote_type === -1).length > 0
      };
    });

    // Group must-see artists (high consensus)
    const groupMustSeeArtists = artistAnalysis
      .filter(artist => artist.isGroupMustSee)
      .sort((a, b) => b.totalPositiveVotes - a.totalPositiveVotes);

    // Controversial artists (mixed votes)
    const controversialArtists = artistAnalysis
      .filter(artist => artist.isControversial)
      .sort((a, b) => (b.mustGoVotes + b.interestedVotes) - (a.mustGoVotes + a.interestedVotes));

    // Genre analysis for group
    const genreAnalysis = artistAnalysis
      .filter(artist => artist.totalPositiveVotes > 0)
      .reduce((acc: any, artist) => {
        const genre = artist.music_genres?.name || 'Other';
        if (!acc[genre]) {
          acc[genre] = { name: genre, votes: 0, artists: 0 };
        }
        acc[genre].votes += artist.totalPositiveVotes;
        acc[genre].artists += 1;
        return acc;
      }, {});

    const topGenres = Object.values(genreAnalysis)
      .sort((a: any, b: any) => b.votes - a.votes)
      .slice(0, 5);

    // Stage distribution for group favorites
    const stageDistribution = groupMustSeeArtists.reduce((acc: any, artist) => {
      const stage = artist.stage || 'TBD';
      if (!acc[stage]) acc[stage] = 0;
      acc[stage]++;
      return acc;
    }, {});

    // Overall group stats
    const groupStats = {
      totalGroupArtists: artistAnalysis.filter(a => a.totalPositiveVotes > 0).length,
      consensusArtists: groupMustSeeArtists.length,
      controversialCount: controversialArtists.length,
      averageConsensus: artistAnalysis.reduce((sum, a) => sum + a.consensusScore, 0) / artistAnalysis.length,
      groupEngagement: artistAnalysis.filter(a => a.totalPositiveVotes > 0).length / allArtists.length
    };

    return {
      currentGroup,
      groupMustSeeArtists,
      controversialArtists,
      topGenres,
      stageDistribution,
      groupStats,
      artistAnalysis
    };
  }, [groups, allArtists, user, selectedGroupId]);

  return {
    groupAnalytics,
    hasGroups: groups.length > 0,
    currentGroup: groupAnalytics?.currentGroup
  };
};