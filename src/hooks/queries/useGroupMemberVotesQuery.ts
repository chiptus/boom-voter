import { useQuery } from "@tanstack/react-query";
import { groupQueries, queryFunctions } from "@/services/queries";

export const useGroupMemberVotesQuery = (groupId: string | undefined, artistId: string | undefined) => {
  return useQuery({
    queryKey: groupQueries.memberVotes(groupId || '', artistId || ''),
    queryFn: () => queryFunctions.fetchGroupMemberVotes(groupId!, artistId!),
    enabled: !!groupId && !!artistId,
  });
};