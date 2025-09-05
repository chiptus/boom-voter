import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { customLinksKeys } from "./useCustomLinks";

interface CreateCustomLinkData {
  festival_id: string;
  title: string;
  url: string;
  display_order?: number;
}

interface UpdateCustomLinkData {
  title: string;
  url: string;
  display_order?: number;
}

interface BulkUpdateCustomLinksData {
  festivalId: string;
  links: Array<{
    id?: string;
    title: string;
    url: string;
    display_order: number;
  }>;
}

async function createCustomLink(data: CreateCustomLinkData) {
  const { data: result, error } = await supabase
    .from("custom_links")
    .insert(data)
    .select()
    .single();

  if (error) throw error;
  return result;
}

async function updateCustomLink(id: string, data: UpdateCustomLinkData) {
  const { data: result, error } = await supabase
    .from("custom_links")
    .update(data)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return result;
}

async function deleteCustomLink(id: string) {
  const { error } = await supabase.from("custom_links").delete().eq("id", id);

  if (error) throw error;
}

async function bulkUpdateCustomLinks({
  festivalId,
  links,
}: BulkUpdateCustomLinksData) {
  // First, get existing links
  const { data: existingLinks, error: fetchError } = await supabase
    .from("custom_links")
    .select("id")
    .eq("festival_id", festivalId);

  if (fetchError) throw fetchError;

  // Delete existing links that aren't in the new list
  const newLinkIds = links.filter((link) => link.id).map((link) => link.id);
  const linksToDelete =
    existingLinks?.filter((link) => !newLinkIds.includes(link.id)) || [];

  if (linksToDelete.length > 0) {
    const { error: deleteError } = await supabase
      .from("custom_links")
      .delete()
      .in(
        "id",
        linksToDelete.map((link) => link.id),
      );

    if (deleteError) throw deleteError;
  }

  // Update or create links
  const promises = links.map(async (link, index) => {
    const linkData = {
      title: link.title,
      url: link.url,
      display_order: index,
    };

    if (link.id) {
      // Update existing link
      const { error } = await supabase
        .from("custom_links")
        .update(linkData)
        .eq("id", link.id);

      if (error) throw error;
    } else {
      // Create new link
      const { error } = await supabase.from("custom_links").insert({
        ...linkData,
        festival_id: festivalId,
      });

      if (error) throw error;
    }
  });

  await Promise.all(promises);
}

export function useCreateCustomLinkMutation() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: createCustomLink,
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: customLinksKeys.byFestival(data.festival_id),
      });
      toast({
        title: "Success",
        description: "Custom link created successfully",
      });
    },
    onError: (error) => {
      console.error("Error creating custom link:", error);
      toast({
        title: "Error",
        description: "Failed to create custom link",
        variant: "destructive",
      });
    },
  });
}

export function useUpdateCustomLinkMutation() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateCustomLinkData }) =>
      updateCustomLink(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: customLinksKeys.byFestival(data.festival_id),
      });
      toast({
        title: "Success",
        description: "Custom link updated successfully",
      });
    },
    onError: (error) => {
      console.error("Error updating custom link:", error);
      toast({
        title: "Error",
        description: "Failed to update custom link",
        variant: "destructive",
      });
    },
  });
}

export function useDeleteCustomLinkMutation() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: deleteCustomLink,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: customLinksKeys.all });
      toast({
        title: "Success",
        description: "Custom link deleted successfully",
      });
    },
    onError: (error) => {
      console.error("Error deleting custom link:", error);
      toast({
        title: "Error",
        description: "Failed to delete custom link",
        variant: "destructive",
      });
    },
  });
}

export function useBulkUpdateCustomLinksMutation() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: bulkUpdateCustomLinks,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: customLinksKeys.byFestival(variables.festivalId),
      });
      toast({
        title: "Success",
        description: "Custom links updated successfully",
      });
    },
    onError: (error) => {
      console.error("Error updating custom links:", error);
      toast({
        title: "Error",
        description: "Failed to update custom links",
        variant: "destructive",
      });
    },
  });
}
