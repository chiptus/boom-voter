import { useQuery } from "@tanstack/react-query";
import { groupQueries, queryFunctions } from "@/services/queries";

export const useGroupFilteredNotesQuery = (groupId: string | undefined, artistId: string) => {
  return useQuery({
    queryKey: groupQueries.filteredNotes(groupId, artistId),
    queryFn: () => queryFunctions.fetchGroupFilteredArtistNotes(groupId, artistId),
    enabled: !!artistId,
  });
};