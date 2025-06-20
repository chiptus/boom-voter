import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const useKnowledge = (user: any) => {
  const [userKnowledge, setUserKnowledge] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (user) {
      fetchUserKnowledge(user.id);
    } else {
      setUserKnowledge({});
    }

    // Listen for real-time updates to knowledge
    const knowledgeChannel = supabase
      .channel('knowledge-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'artist_knowledge' }, () => {
        if (user) {
          fetchUserKnowledge(user.id);
        }
      })
      .subscribe();

    return () => {
      knowledgeChannel.unsubscribe();
    };
  }, [user]);

  const fetchUserKnowledge = async (userId: string) => {
    const { data, error } = await supabase
      .from("artist_knowledge")
      .select("artist_id")
      .eq("user_id", userId);

    if (!error && data) {
      const knowledgeMap = data.reduce((acc, knowledge) => {
        acc[knowledge.artist_id] = true;
        return acc;
      }, {} as Record<string, boolean>);
      setUserKnowledge(knowledgeMap);
    }
  };

  const handleKnowledgeToggle = async (artistId: string) => {
    if (!user) {
      return { requiresAuth: true };
    }

    const isKnown = userKnowledge[artistId];
    
    if (isKnown) {
      // Remove knowledge entry
      const { error } = await supabase
        .from("artist_knowledge")
        .delete()
        .eq("user_id", user.id)
        .eq("artist_id", artistId);

      if (!error) {
        setUserKnowledge(prev => {
          const newKnowledge = { ...prev };
          delete newKnowledge[artistId];
          return newKnowledge;
        });
      }
    } else {
      // Add knowledge entry
      const { error } = await supabase
        .from("artist_knowledge")
        .insert({
          user_id: user.id,
          artist_id: artistId,
        });

      if (!error) {
        setUserKnowledge(prev => ({ ...prev, [artistId]: true }));
      }
    }

    return { requiresAuth: false };
  };

  return {
    userKnowledge,
    handleKnowledgeToggle,
  };
};