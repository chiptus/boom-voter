import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useProfileQuery } from "@/hooks/queries/useProfileQuery";

export const useAuth = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  // Use TanStack Query for profile data
  const { data: profile } = useProfileQuery(user?.id);

  useEffect(() => {
    getUser();
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      setUser(session?.user || null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const getUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setUser(user);
    setLoading(false);
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const hasUsername = () => {
    return profile?.username && profile.username.trim() !== '';
  };

  return {
    user,
    profile,
    loading,
    hasUsername,
    signOut,
  };
};