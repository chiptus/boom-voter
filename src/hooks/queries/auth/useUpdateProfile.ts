import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { profileKeys } from "./useProfile";
import { profileOfflineService } from "@/services/profileOfflineService";

// Mutation function
async function updateProfile(variables: {
  userId: string;
  updates: { username?: string | null };
}) {
  const { userId, updates } = variables;

  // Validate username uniqueness before attempting update
  const { data: validationResult, error: validationError } = await supabase.rpc(
    "validate_profile_update",
    {
      user_id: userId,
      new_username: updates.username?.trim(),
    },
  );

  console.log(
    "Validation result:",
    validationResult,
    "Error:",
    validationError,
  );

  if (validationError) {
    throw new Error("Failed to validate profile data");
  }

  if (validationResult) {
    throw new Error(validationResult);
  }

  const { data, error } = await supabase
    .from("profiles")
    .update(updates)
    .eq("id", userId)
    .select()
    .single();

  if (error) {
    throw new Error("Failed to update profile");
  }

  return data;
}

// Hook
export function useUpdateProfileMutation() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: updateProfile,
    onSuccess: async (data, variables) => {
      // Update the profile cache
      queryClient.setQueryData(profileKeys.detail(variables.userId), data);

      // Update offline cache
      await profileOfflineService.cacheProfile(variables.userId, data);

      // Invalidate to ensure consistency
      queryClient.invalidateQueries({
        queryKey: profileKeys.detail(variables.userId),
      });

      toast({
        title: "Success",
        description: "Profile updated successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error?.message || "Failed to update profile",
        variant: "destructive",
      });
    },
  });
}
