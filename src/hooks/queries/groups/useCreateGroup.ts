import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { userGroupsKeys } from "./useUserGroups";
import { generateSlug } from "@/lib/slug";

// Mutation function
async function createGroup(variables: {
  name: string;
  description?: string;
  userId: string;
}) {
  const { name, description, userId } = variables;

  const { data: group, error } = await supabase
    .from("groups")
    .insert({
      name,
      slug: generateSlug(name),
      description,
      created_by: userId,
    })
    .select()
    .single();

  if (error) {
    throw new Error(error.message || "Failed to create group");
  }

  // Add creator as first member
  const { error: memberError } = await supabase.from("group_members").insert({
    group_id: group.id,
    user_id: userId,
    role: "creator",
  });

  if (memberError) {
    throw new Error("Group created but failed to add you as member");
  }

  return group;
}

// Hook
export function useCreateGroupMutation() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: createGroup,
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: userGroupsKeys.user(variables.userId),
      });
      queryClient.invalidateQueries({
        queryKey: userGroupsKeys.all,
      });
      toast({
        title: "Success",
        description: "Group created successfully",
      });
    },
    onError: (error) => {
      const message = error?.message || "Failed to create group";
      toast({
        title: message.includes("failed to add") ? "Warning" : "Error",
        description: message,
        variant: "destructive",
      });
    },
  });
}
