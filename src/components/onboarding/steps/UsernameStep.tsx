import { useUpdateProfileMutation } from "@/hooks/queries/auth/useUpdateProfile";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { User as UserIcon } from "lucide-react";
import { User } from "@supabase/supabase-js";

interface UsernameStepProps {
  user: User;
  username: string;
  setUsername: (username: string) => void;
  onNext: () => void;
}

export function UsernameStep({
  user,
  username,
  setUsername,
  onNext,
}: UsernameStepProps) {
  const { toast } = useToast();
  const updateProfileMutation = useUpdateProfileMutation();

  function handleSubmit(e: React.FormEvent) {
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
            title: "Username set!",
            description: "Let's show you around UpLine.",
          });
          onNext();
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
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header - fixed */}
      <DialogHeader>
        <DialogTitle className="flex items-center space-x-2">
          <UserIcon className="h-5 w-5" />
          <span>Welcome to UpLine!</span>
        </DialogTitle>
        <DialogDescription>
          Let's start by choosing your username. This is how other
          festival-goers will see you in groups.
        </DialogDescription>
      </DialogHeader>

      {/* Form content - scrollable if needed */}
      <div className="flex-1 overflow-y-auto mt-4 min-h-0">
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
        </form>
      </div>

      {/* Button - fixed at bottom */}
      <div className="pt-4 mt-4 border-t">
        <Button
          onClick={handleSubmit}
          className="w-full"
          disabled={updateProfileMutation.isPending || !username.trim()}
        >
          {updateProfileMutation.isPending ? "Setting up..." : "Continue"}
        </Button>
      </div>
    </div>
  );
}
