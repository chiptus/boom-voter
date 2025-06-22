import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Star, Heart, X, Users } from "lucide-react";
import { useGroups } from "@/hooks/useGroups";
import { useGroupMemberVotesQuery } from "@/hooks/queries/useGroupMemberVotesQuery";

interface ArtistGroupVotesProps {
  artistId: string;
}

const getVoteIcon = (voteType: number) => {
  switch (voteType) {
    case 2:
      return <Star className="h-4 w-4 text-orange-400" />;
    case 1:
      return <Heart className="h-4 w-4 text-blue-400" />;
    case -1:
      return <X className="h-4 w-4 text-gray-400" />;
    default:
      return null;
  }
};

const getVoteText = (voteType: number) => {
  switch (voteType) {
    case 2:
      return "Must Go";
    case 1:
      return "Interested";
    case -1:
      return "Won't Go";
    default:
      return "No Vote";
  }
};

const getVoteColor = (voteType: number) => {
  switch (voteType) {
    case 2:
      return "bg-orange-600/50 text-orange-100 border-orange-400/30";
    case 1:
      return "bg-blue-600/50 text-blue-100 border-blue-400/30";
    case -1:
      return "bg-gray-600/50 text-gray-100 border-gray-400/30";
    default:
      return "bg-purple-600/50 text-purple-100 border-purple-400/30";
  }
};

export const ArtistGroupVotes = ({ artistId }: ArtistGroupVotesProps) => {
  const { groups } = useGroups();
  
  // For now, use the first group - later we can add group selection
  const currentGroup = groups[0];
  
  const { data: memberVotes = [], isLoading } = useGroupMemberVotesQuery(
    currentGroup?.id,
    artistId
  );

  if (!currentGroup || groups.length === 0) {
    return null;
  }

  if (isLoading) {
    return (
      <Card className="bg-white/10 backdrop-blur-md border-purple-400/30">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Users className="h-5 w-5" />
            Group Votes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-purple-200">Loading group votes...</p>
        </CardContent>
      </Card>
    );
  }

  if (memberVotes.length === 0) {
    return (
      <Card className="bg-white/10 backdrop-blur-md border-purple-400/30">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Users className="h-5 w-5" />
            Group Votes - {currentGroup.name}
          </CardTitle>
          <CardDescription className="text-purple-200">
            No votes from your group members yet
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="bg-white/10 backdrop-blur-md border-purple-400/30">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Users className="h-5 w-5" />
          Group Votes - {currentGroup.name}
        </CardTitle>
        <CardDescription className="text-purple-200">
          How your group members voted on this artist
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {memberVotes.map((vote) => (
            <div key={vote.user_id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
              <div className="flex items-center gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-purple-600 text-white text-sm">
                    {(vote.username || vote.email || 'U').charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-white font-medium">
                    {vote.username || vote.email || 'Anonymous User'}
                  </p>
                  {vote.username && vote.email && (
                    <p className="text-xs text-purple-300">{vote.email}</p>
                  )}
                </div>
              </div>
              <Badge 
                variant="outline" 
                className={`flex items-center gap-1 ${getVoteColor(vote.vote_type)}`}
              >
                {getVoteIcon(vote.vote_type)}
                {getVoteText(vote.vote_type)}
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};