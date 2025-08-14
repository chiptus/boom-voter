import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { useUserGroupsQuery } from "@/hooks/queries/groups/useUserGroups";
import { useGroupVotesQuery } from "@/hooks/queries/voting/useGroupVotes";
import { Users, ThumbsUp, Heart, ThumbsDown } from "lucide-react";

interface ArtistGroupVotingProps {
  artistId: string;
}

function getVoteIcon(voteType: number) {
  switch (voteType) {
    case 2:
      return <Heart className="h-4 w-4" />;
    case 1:
      return <ThumbsUp className="h-4 w-4" />;
    case -1:
      return <ThumbsDown className="h-4 w-4" />;
    default:
      return null;
  }
}

function getVoteLabel(voteType: number) {
  switch (voteType) {
    case 2:
      return "Must Go";
    case 1:
      return "Interested";
    case -1:
      return "Won't Go";
    default:
      return "Unknown";
  }
}

function getVoteColor(voteType: number) {
  switch (voteType) {
    case 2:
      return "bg-red-500/20 text-red-400 border-red-400/30";
    case 1:
      return "bg-green-500/20 text-green-400 border-green-400/30";
    case -1:
      return "bg-gray-500/20 text-gray-400 border-gray-400/30";
    default:
      return "bg-gray-500/20 text-gray-400 border-gray-400/30";
  }
}

export function ArtistGroupVoting({ artistId }: ArtistGroupVotingProps) {
  const { user } = useAuth();
  const { data: groups = [] } = useUserGroupsQuery(user?.id);
  const [selectedGroupId, setSelectedGroupId] = useState<string>("");

  // Set default group when groups load
  useEffect(() => {
    if (groups.length > 0 && !selectedGroupId) {
      setSelectedGroupId(groups[0].id);
    }
  }, [groups, selectedGroupId]);

  // Use React Query to fetch group votes
  const { data: groupVotes = [], isLoading: loading } = useGroupVotesQuery(
    artistId,
    selectedGroupId,
  );

  // Don't show if user has no groups
  if (!user || groups.length === 0) {
    return null;
  }

  const voteCounts = {
    2: groupVotes.filter((vote) => vote.vote_type === 2).length,
    1: groupVotes.filter((vote) => vote.vote_type === 1).length,
    [-1]: groupVotes.filter((vote) => vote.vote_type === -1).length,
  };

  const selectedGroup = groups.find((g) => g.id === selectedGroupId);

  return (
    <Card className="bg-white/10 backdrop-blur-md border-purple-400/30">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-white flex items-center gap-2">
            <Users className="h-5 w-5" />
            Group Voting
          </CardTitle>
          {groups.length > 1 && (
            <Select value={selectedGroupId} onValueChange={setSelectedGroupId}>
              <SelectTrigger className="w-48 bg-white/5 border-purple-400/30 text-white">
                <SelectValue placeholder="Select group" />
              </SelectTrigger>
              <SelectContent>
                {groups.map((group) => (
                  <SelectItem key={group.id} value={group.id}>
                    {group.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>
        {selectedGroup && (
          <p className="text-purple-200 text-sm">
            How {selectedGroup.name} voted on this artist
          </p>
        )}
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="text-center py-4 text-purple-200">
            Loading votes...
          </div>
        ) : groupVotes.length === 0 ? (
          <div className="text-center py-4 text-purple-200">
            No one in this group has voted on this artist yet.
          </div>
        ) : (
          <div className="space-y-4">
            {/* Vote Summary */}
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <Heart className="h-4 w-4 text-red-400" />
                  <span className="text-white font-semibold">
                    {voteCounts[2]}
                  </span>
                </div>
                <p className="text-red-400 text-sm">Must Go</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <ThumbsUp className="h-4 w-4 text-green-400" />
                  <span className="text-white font-semibold">
                    {voteCounts[1]}
                  </span>
                </div>
                <p className="text-green-400 text-sm">Interested</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <ThumbsDown className="h-4 w-4 text-gray-400" />
                  <span className="text-white font-semibold">
                    {voteCounts[-1]}
                  </span>
                </div>
                <p className="text-gray-400 text-sm">Won't Go</p>
              </div>
            </div>

            {/* Individual Votes */}
            <div className="space-y-2">
              <h4 className="text-white font-medium text-sm mb-2">
                Individual Votes:
              </h4>
              {groupVotes.map((vote) => (
                <div
                  key={vote.user_id}
                  className="flex items-center justify-between py-2 px-3 rounded-lg bg-white/5"
                >
                  <span className="text-purple-200">
                    {vote.username || "Unknown User"}
                  </span>
                  <Badge
                    className={`${getVoteColor(vote.vote_type)} flex items-center gap-1`}
                  >
                    {getVoteIcon(vote.vote_type)}
                    {getVoteLabel(vote.vote_type)}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
