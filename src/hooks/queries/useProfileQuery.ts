import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { authQueries, queryFunctions, mutationFunctions } from "@/services/queries";
import type { Database } from "@/integrations/supabase/types";

type Profile = Database["public"]["Tables"]["profiles"]["Row"];

export const useProfileQuery = (userId?: string) => {
  return useQuery({
    queryKey: authQueries.profile(userId),
    queryFn: () => userId ? queryFunctions.fetchProfile(userId) : null,
    enabled: !!userId,
  });
};

export const useUpdateProfileMutation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: mutationFunctions.updateProfile,
    onSuccess: (data, variables) => {
      // Update the profile cache
      queryClient.setQueryData(authQueries.profile(variables.userId), data);
      
      // Invalidate to ensure consistency
      queryClient.invalidateQueries({
        queryKey: authQueries.profile(variables.userId),
      });
    },
  });
};