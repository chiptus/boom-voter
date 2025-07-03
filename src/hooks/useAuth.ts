import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useProfileQuery } from "@/hooks/queries/useProfileQuery";
import { useToast } from "@/hooks/use-toast";
import { User } from "@supabase/supabase-js";

export const useAuth = () => {
  const [user, setUser] = useState<User>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const profileQuery = useProfileQuery(user?.id);

  const profile = profileQuery.data;

  useEffect(() => {
    // Set up auth state listener first
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setUser(session?.user || null);
      setLoading(false);

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
      setUser(session?.user || null);
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [toast]);

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  function hasUsername() {
    return (
      // loading ||
      // profileQuery.isLoading ||
      (profile?.username && profile?.username.trim() !== "")
    );
  }

  return {
    user,
    profile,
    loading,
    hasUsername,
    signOut,
  };
};
