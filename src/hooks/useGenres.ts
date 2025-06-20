
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const useGenres = () => {
  const [genres, setGenres] = useState<Array<{ id: string; name: string }>>([]);
  const { toast } = useToast();

  useEffect(() => {
    fetchGenres();
  }, []);

  const fetchGenres = async () => {
    const { data, error } = await supabase
      .from('music_genres')
      .select('id, name')
      .order('name');
    
    if (error) {
      toast({
        title: "Error",
        description: "Failed to load genres",
        variant: "destructive",
      });
    } else {
      setGenres(data || []);
    }
  };

  return { genres };
};
