import { useQuery } from "@tanstack/react-query";
import { groupQueries, queryFunctions } from "@/services/queries";

export const useAllGroupMemberVotesQuery = (userGroupIds: string[], artistId: string) => {
  return useQuery({
    queryKey: groupQueries.memberVotes('all-groups', artistId),
    queryFn: () => queryFunctions.fetchAllGroupMemberVotes(userGroupIds, artistId),
    enabled: userGroupIds.length > 0 && !!artistId,
  });
};