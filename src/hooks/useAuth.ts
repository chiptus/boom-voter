import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useProfileQuery } from "@/hooks/queries/useProfileQuery";
import { profileOfflineService } from "@/services/profileOfflineService";
import { useToast } from "@/hooks/use-toast";
import { User, Session } from "@supabase/supabase-js";

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const profileQuery = useProfileQuery(user?.id);

  const profile = profileQuery.data;

  useEffect(() => {
    // Set up auth state listener first
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setSession(session);
      setUser(session?.user || null);
      setLoading(false);

      // Clear cached profile on sign out for security
      if (event === "SIGNED_OUT") {
        if (user?.id) {
          await profileOfflineService.clearCachedProfile(user.id);
        }
      }

      // Handle invite processing when user signs in
      if (event === "SIGNED_IN" && session?.user) {
        const urlParams = new URLSearchParams(window.location.search);
        const inviteToken = urlParams.get("invite");

        if (inviteToken) {
          try {
            const { data, error } = await supabase.rpc("use_invite_token", {
              token: inviteToken,
              user_id: session.user.id,
            });

            if (error) {
              console.error("Error using invite:", error);
              toast({
                title: "Error",
                description: "Failed to join group",
                variant: "destructive",
              });
            } else if (data && data.length > 0) {
              const result = data[0];
              if (result.success) {
                toast({
                  title: "Success",
                  description: "Welcome to the group!",
                });
                // Clear invite from URL
                const newUrl = new URL(window.location.href);
                newUrl.searchParams.delete("invite");
                window.history.replaceState({}, "", newUrl.toString());
              } else {
                toast({
                  title: "Error",
                  description: result.message,
                  variant: "destructive",
                });
              }
            }
          } catch (error) {
            console.error("Error processing invite:", error);
          }
        }
      }
    });

    // Then check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user || null);
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [toast]);

  const signOut = async () => {
    // Clear cached profile before signing out
    if (user?.id) {
      await profileOfflineService.clearCachedProfile(user.id);
    }
    await supabase.auth.signOut();
  };

 

  const hasUsername = useMemo(() => {
    return (
      // loading ||
      // profileQuery.isLoading ||
      (profile?.username && profile?.username.trim() !== "")
    );
  }, [profile]);

  return {
    user,
    session,
    profile,
    loading,
    hasUsername,
    signOut,
  };
};
