
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useArtists } from "@/hooks/useArtists";
import { useGroupAnalytics } from "@/hooks/useGroupAnalytics";
import { useGroups } from "@/hooks/useGroups";
import { GroupSelector } from "@/components/GroupSelector";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AuthDialog } from "@/components/AuthDialog";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { Star, Heart, X, TrendingUp, Users, Calendar, MapPin, UsersIcon, AlertTriangle } from "lucide-react";

const Analytics = () => {
  const { user } = useAuth();
  const { allArtists, userVotes } = useArtists();
  const { groups } = useGroups();
  const [selectedGroupId, setSelectedGroupId] = useState<string | undefined>();
  const { groupAnalytics, hasGroups } = useGroupAnalytics(selectedGroupId);
  const [showAuthDialog, setShowAuthDialog] = useState(false);

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-white/10 backdrop-blur-md border-purple-400/30">
          <CardHeader className="text-center">
            <CardTitle className="text-white">Analytics Dashboard</CardTitle>
            <CardDescription className="text-purple-200">
              Sign in to view your festival voting analytics
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={() => setShowAuthDialog(true)}
              className="w-full bg-purple-600 hover:bg-purple-700"
            >
              Sign In to View Analytics
            </Button>
          </CardContent>
        </Card>
        <AuthDialog
          open={showAuthDialog}
          onOpenChange={setShowAuthDialog}
          onSuccess={() => setShowAuthDialog(false)}
        />
      </div>
    );
  }

  // Calculate analytics data
  const getVoteCount = (artist: any, voteType: number) => {
    return artist.votes.filter((vote: any) => vote.vote_type === voteType).length;
  };

  const mustGoArtists = allArtists
    .filter(artist => userVotes[artist.id] === 2)
    .map(artist => ({
      ...artist,
      popularity: getVoteCount(artist, 2) + getVoteCount(artist, 1)
    }))
    .sort((a, b) => b.popularity - a.popularity);

  const myVotingStats = {
    mustGo: allArtists.filter(artist => userVotes[artist.id] === 2).length,
    interested: allArtists.filter(artist => userVotes[artist.id] === 1).length,
    wontGo: allArtists.filter(artist => userVotes[artist.id] === -1).length,
  };

  const genreBreakdown = allArtists
    .filter(artist => userVotes[artist.id] && userVotes[artist.id] > 0)
    .reduce((acc: any, artist) => {
      const genre = artist.music_genres?.name || 'Other';
      if (!acc[genre]) acc[genre] = 0;
      acc[genre]++;
      return acc;
    }, {});

  const genreChartData = Object.entries(genreBreakdown).map(([genre, count]) => ({
    genre,
    count
  }));

  const topArtistsByPopularity = allArtists
    .map(artist => ({
      name: artist.name,
      mustGo: getVoteCount(artist, 2),
      interested: getVoteCount(artist, 1),
      total: getVoteCount(artist, 2) + getVoteCount(artist, 1)
    }))
    .sort((a, b) => b.total - a.total)
    .slice(0, 10);

  const stageBreakdown = mustGoArtists.reduce((acc: any, artist) => {
    const stage = artist.stage || 'TBD';
    if (!acc[stage]) acc[stage] = 0;
    acc[stage]++;
    return acc;
  }, {});

  const pieColors = ['#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444', '#ec4899'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Festival Analytics</h1>
          <p className="text-purple-200">Insights from your voting patterns and festival data</p>
        </div>

        <Tabs defaultValue="personal" className="space-y-6">
          <TabsList className="bg-white/10 backdrop-blur-md border-purple-400/30">
            <TabsTrigger value="personal" className="data-[state=active]:bg-purple-600">
              My Analytics
            </TabsTrigger>
            {hasGroups && (
              <TabsTrigger value="groups" className="data-[state=active]:bg-purple-600">
                Group Analytics
              </TabsTrigger>
            )}
            <TabsTrigger value="festival" className="data-[state=active]:bg-purple-600">
              Festival Overview
            </TabsTrigger>
            <TabsTrigger value="schedule" className="data-[state=active]:bg-purple-600">
              My Schedule
            </TabsTrigger>
          </TabsList>

          <TabsContent value="personal" className="space-y-6">
            {/* Personal Voting Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="bg-white/10 backdrop-blur-md border-purple-400/30">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-white">Must Go</CardTitle>
                  <Star className="h-4 w-4 text-orange-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-orange-400">{myVotingStats.mustGo}</div>
                  <p className="text-xs text-purple-200">Artists you must see</p>
                </CardContent>
              </Card>
              <Card className="bg-white/10 backdrop-blur-md border-purple-400/30">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-white">Interested</CardTitle>
                  <Heart className="h-4 w-4 text-blue-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-400">{myVotingStats.interested}</div>
                  <p className="text-xs text-purple-200">Artists you're interested in</p>
                </CardContent>
              </Card>
              <Card className="bg-white/10 backdrop-blur-md border-purple-400/30">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-white">Won't Go</CardTitle>
                  <X className="h-4 w-4 text-gray-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-400">{myVotingStats.wontGo}</div>
                  <p className="text-xs text-purple-200">Artists you'll skip</p>
                </CardContent>
              </Card>
            </div>

            {/* Genre Breakdown */}
            {genreChartData.length > 0 && (
              <Card className="bg-white/10 backdrop-blur-md border-purple-400/30">
                <CardHeader>
                  <CardTitle className="text-white">Your Genre Preferences</CardTitle>
                  <CardDescription className="text-purple-200">
                    Based on your positive votes
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={genreChartData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ genre, percent }) => `${genre} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="count"
                      >
                        {genreChartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            )}
          </TabsContent>

            {hasGroups && groupAnalytics && (
            <TabsContent value="groups" className="space-y-6">
              {/* Group Header with Selector */}
              <Card className="bg-white/10 backdrop-blur-md border-purple-400/30">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-white flex items-center gap-2">
                        <UsersIcon className="h-5 w-5" />
                        {groupAnalytics.currentGroup.name} Analytics
                      </CardTitle>
                      <CardDescription className="text-purple-200">
                        Collaborative insights for your group of {groupAnalytics.currentGroup.member_count} members
                      </CardDescription>
                    </div>
                    {groups.length > 1 && (
                      <GroupSelector
                        selectedGroupId={selectedGroupId}
                        onGroupChange={setSelectedGroupId}
                      />
                    )}
                  </div>
                </CardHeader>
              </Card>

              {/* Group Stats Overview */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card className="bg-white/10 backdrop-blur-md border-purple-400/30">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-white">Group Consensus</CardTitle>
                    <Users className="h-4 w-4 text-green-400" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-green-400">{groupAnalytics.groupMustSeeArtists.length}</div>
                    <p className="text-xs text-purple-200">Artists group agrees on</p>
                  </CardContent>
                </Card>
                <Card className="bg-white/10 backdrop-blur-md border-purple-400/30">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-white">Controversial</CardTitle>
                    <AlertTriangle className="h-4 w-4 text-orange-400" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-orange-400">{groupAnalytics.controversialArtists.length}</div>
                    <p className="text-xs text-purple-200">Artists with mixed votes</p>
                  </CardContent>
                </Card>
                <Card className="bg-white/10 backdrop-blur-md border-purple-400/30">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-white">Group Engagement</CardTitle>
                    <TrendingUp className="h-4 w-4 text-blue-400" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-blue-400">{Math.round(groupAnalytics.groupStats.groupEngagement * 100)}%</div>
                    <p className="text-xs text-purple-200">Artists with votes</p>
                  </CardContent>
                </Card>
                <Card className="bg-white/10 backdrop-blur-md border-purple-400/30">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-white">Consensus Score</CardTitle>
                    <Star className="h-4 w-4 text-purple-400" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-purple-400">{Math.round(groupAnalytics.groupStats.averageConsensus * 100)}%</div>
                    <p className="text-xs text-purple-200">Average agreement</p>
                  </CardContent>
                </Card>
              </div>

              {/* Group Must-See Artists */}
              <Card className="bg-white/10 backdrop-blur-md border-purple-400/30">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Star className="h-5 w-5" />
                    Group Must-See Artists
                  </CardTitle>
                  <CardDescription className="text-purple-200">
                    Artists your group has consensus on (60%+ agreement)
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {groupAnalytics.groupMustSeeArtists.length === 0 ? (
                    <p className="text-purple-200 text-center py-8">
                      No group consensus yet. Keep voting to find artists your group agrees on!
                    </p>
                  ) : (
                    <div className="space-y-4">
                      {groupAnalytics.groupMustSeeArtists.slice(0, 10).map((artist, index) => (
                        <div key={artist.id} className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                          <div className="flex items-center gap-3">
                            <span className="text-green-400 font-bold text-lg">#{index + 1}</span>
                            <div>
                              <h3 className="text-white font-semibold">{artist.name}</h3>
                              <div className="flex items-center gap-4 text-sm text-purple-200">
                                {artist.music_genres && (
                                  <Badge variant="secondary" className="bg-purple-600/50 text-purple-100">
                                    {artist.music_genres.name}
                                  </Badge>
                                )}
                                {artist.stage && (
                                  <div className="flex items-center gap-1">
                                    <MapPin className="h-3 w-3" />
                                    <span>{artist.stage}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-white font-semibold">{artist.mustGoVotes} must-go votes</div>
                            <div className="text-xs text-purple-200">{Math.round(artist.consensusScore * 100)}% consensus</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Controversial Artists */}
              {groupAnalytics.controversialArtists.length > 0 && (
                <Card className="bg-white/10 backdrop-blur-md border-purple-400/30">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5" />
                      Controversial Artists
                    </CardTitle>
                    <CardDescription className="text-purple-200">
                      Artists with mixed positive and negative votes in your group
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {groupAnalytics.controversialArtists.slice(0, 5).map((artist, index) => (
                        <div key={artist.id} className="flex items-center justify-between p-4 bg-white/5 rounded-lg border-l-4 border-orange-400">
                          <div className="flex items-center gap-3">
                            <div>
                              <h3 className="text-white font-semibold">{artist.name}</h3>
                              <div className="flex items-center gap-4 text-sm text-purple-200">
                                {artist.music_genres && (
                                  <Badge variant="secondary" className="bg-purple-600/50 text-purple-100">
                                    {artist.music_genres.name}
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-white font-semibold">{artist.mustGoVotes + artist.interestedVotes} positive</div>
                            <div className="text-xs text-purple-200">Group split decision</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Group Genre Preferences */}
              {groupAnalytics.topGenres.length > 0 && (
                <Card className="bg-white/10 backdrop-blur-md border-purple-400/30">
                  <CardHeader>
                    <CardTitle className="text-white">Group Genre Preferences</CardTitle>
                    <CardDescription className="text-purple-200">
                      Combined voting patterns across your group
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={groupAnalytics.topGenres}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis 
                          dataKey="name" 
                          stroke="#9ca3af"
                        />
                        <YAxis stroke="#9ca3af" />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: 'rgba(0,0,0,0.8)', 
                            border: '1px solid #8b5cf6',
                            borderRadius: '8px'
                          }}
                        />
                        <Bar dataKey="votes" fill="#8b5cf6" name="Group Votes" />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              )}

              {/* Group Stage Distribution */}
              {Object.keys(groupAnalytics.stageDistribution).length > 0 && (
                <Card className="bg-white/10 backdrop-blur-md border-purple-400/30">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <MapPin className="h-5 w-5" />
                      Group Stage Coverage
                    </CardTitle>
                    <CardDescription className="text-purple-200">
                      Where your group will be during the festival
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {Object.entries(groupAnalytics.stageDistribution).map(([stage, count]) => (
                        <div key={stage} className="text-center p-4 bg-white/5 rounded-lg">
                          <div className="text-2xl font-bold text-green-400">{count as number}</div>
                          <div className="text-sm text-purple-200">{stage}</div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          )}

          <TabsContent value="festival" className="space-y-6">
            {/* Most Popular Artists */}
            <Card className="bg-white/10 backdrop-blur-md border-purple-400/30">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Most Popular Artists
                </CardTitle>
                <CardDescription className="text-purple-200">
                  Artists with the most positive votes
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={topArtistsByPopularity}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis 
                      dataKey="name" 
                      angle={-45}
                      textAnchor="end"
                      height={100}
                      stroke="#9ca3af"
                    />
                    <YAxis stroke="#9ca3af" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'rgba(0,0,0,0.8)', 
                        border: '1px solid #8b5cf6',
                        borderRadius: '8px'
                      }}
                    />
                    <Bar dataKey="mustGo" stackId="a" fill="#f59e0b" name="Must Go" />
                    <Bar dataKey="interested" stackId="a" fill="#3b82f6" name="Interested" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="schedule" className="space-y-6">
            {/* My Must-See Schedule */}
            <Card className="bg-white/10 backdrop-blur-md border-purple-400/30">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  My Must-See Artists
                </CardTitle>
                <CardDescription className="text-purple-200">
                  Artists you voted "Must Go" for, ordered by popularity
                </CardDescription>
              </CardHeader>
              <CardContent>
                {mustGoArtists.length === 0 ? (
                  <p className="text-purple-200 text-center py-8">
                    No "Must Go" votes yet. Start voting on artists to build your schedule!
                  </p>
                ) : (
                  <div className="space-y-4">
                    {mustGoArtists.map((artist, index) => (
                      <div key={artist.id} className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                        <div className="flex items-center gap-3">
                          <span className="text-purple-400 font-bold text-lg">#{index + 1}</span>
                          <div>
                            <h3 className="text-white font-semibold">{artist.name}</h3>
                            <div className="flex items-center gap-4 text-sm text-purple-200">
                              {artist.music_genres && (
                                <Badge variant="secondary" className="bg-purple-600/50 text-purple-100">
                                  {artist.music_genres.name}
                                </Badge>
                              )}
                              {artist.stage && (
                                <div className="flex items-center gap-1">
                                  <MapPin className="h-3 w-3" />
                                  <span>{artist.stage}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-white font-semibold">{artist.popularity} votes</div>
                          <div className="text-xs text-purple-200">total popularity</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Stage Distribution */}
            {Object.keys(stageBreakdown).length > 0 && (
              <Card className="bg-white/10 backdrop-blur-md border-purple-400/30">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    Stage Distribution
                  </CardTitle>
                  <CardDescription className="text-purple-200">
                    Where you'll be spending your time
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {Object.entries(stageBreakdown).map(([stage, count]) => (
                      <div key={stage} className="text-center p-4 bg-white/5 rounded-lg">
                        <div className="text-2xl font-bold text-purple-400">{count as number}</div>
                        <div className="text-sm text-purple-200">{stage}</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Analytics;
