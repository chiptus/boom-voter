import { useQuery } from "@tanstack/react-query";
import { authQueries } from "@/services/queries";
import { supabase } from "@/integrations/supabase/client";
import { useEffect } from "react";

// Auth query function
const fetchAuthUser = async () => {
  const { data: { session }, error } = await supabase.auth.getSession();
  if (error) throw error;
  return session?.user ?? null;
};

export const useAuthQuery = () => {
  return useQuery({
    queryKey: authQueries.user(),
    queryFn: fetchAuthUser,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    initialData: null, // Start with null user, not loading state
  });
};

export const useAuth = () => {
  const { data: user, isLoading: loading, refetch } = useAuthQuery();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      // Invalidate and refetch auth query when auth state changes
      if (event === 'SIGNED_IN' || event === 'SIGNED_OUT' || event === 'TOKEN_REFRESHED') {
        refetch();
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [refetch]);

  const signOut = async () => {
    await supabase.auth.signOut();
    // Auth state change will trigger refetch automatically
  };

  return {
    user,
    loading,
    signOut,
  };
};