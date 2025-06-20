
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Plus } from "lucide-react";

interface AddGenreDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const AddGenreDialog = ({ open, onOpenChange }: AddGenreDialogProps) => {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to add a genre",
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    const { error } = await supabase
      .from("music_genres")
      .insert({
        name,
        created_by: user.id,
      });

    if (error) {
      if (error.code === '23505') {
        toast({
          title: "Error",
          description: "This genre already exists",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      }
    } else {
      toast({
        title: "Success",
        description: "Music genre added successfully!",
      });
      setName("");
      onOpenChange(false);
    }
    setLoading(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Add New Genre
          </DialogTitle>
          <DialogDescription>
            Add a new music genre that others can use when adding artists.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="genre-name">Genre Name</Label>
            <Input
              id="genre-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="Enter genre name"
            />
          </div>
          
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Adding genre..." : "Add Genre"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
