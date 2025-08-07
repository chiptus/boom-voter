import { useState } from "react";
import { useUpdateProfileMutation } from "@/hooks/queries/useProfileQuery";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { User as UserIcon } from "lucide-react";
import { User } from "@supabase/supabase-js";

interface UsernameSetupDialogProps {
  open: boolean;
  user: User;
  onSuccess: () => void;
}

export const UsernameSetupDialog = ({
  open,
  user,
  onSuccess,
}: UsernameSetupDialogProps) => {
  const [username, setUsername] = useState("");
  const { toast } = useToast();
  const updateProfileMutation = useUpdateProfileMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) return;

    updateProfileMutation.mutate(
      {
        userId: user.id,
        updates: { username: username.trim() },
      },
      {
        onSuccess: () => {
          toast({
            title: "Welcome!",
            description: "Your username has been set successfully.",
          });
          onSuccess();
        },
        onError: (error) => {
          toast({
            title: "Error",
            description: error.message,
            variant: "destructive",
          });
        },
      },
    );
  };

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent
        className="sm:max-w-md"
        onInteractOutside={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <UserIcon className="h-5 w-5" />
            <span>Choose Your Username</span>
          </DialogTitle>
          <DialogDescription>
            Welcome to the Festival! Please choose a username to get started.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              placeholder="Your display name"
              autoFocus
            />
          </div>
          <Button
            type="submit"
            className="w-full"
            disabled={updateProfileMutation.isPending || !username.trim()}
          >
            {updateProfileMutation.isPending
              ? "Setting up..."
              : "Continue to Festival"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
