import { Button } from "@/components/ui/button";
import {
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Sparkles, Music, Users, ArrowRight } from "lucide-react";
import { useUpdateProfileMutation } from "@/hooks/queries/auth/useUpdateProfile";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

interface WelcomeStepProps {
  username: string;
  onComplete: () => void;
}

export function WelcomeStep({ username, onComplete }: WelcomeStepProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const updateProfileMutation = useUpdateProfileMutation();

  function handleComplete() {
    if (!user) return;

    updateProfileMutation.mutate(
      {
        userId: user.id,
        updates: { completed_onboarding: true },
      },
      {
        onSuccess: () => {
          toast({
            title: "Welcome to UpLine!",
            description:
              "You're all set to start planning your festival experience.",
          });
          onComplete();
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
          <Sparkles className="h-5 w-5" />
          <span>You're All Set, {username}!</span>
        </DialogTitle>
        <DialogDescription>
          Welcome to UpLine! You're ready to start planning your perfect
          festival experience.
        </DialogDescription>
      </DialogHeader>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto space-y-4 mt-4 min-h-0">
        {/* Quick Start Tips */}
        <div className="space-y-3">
          <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-lg">
            <Music className="h-4 w-4 text-purple-600 flex-shrink-0" />
            <p className="text-xs text-gray-700 dark:text-gray-300">
              Start by browsing artists and voting on who you want to see
            </p>
          </div>

          <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-blue-50 to-green-50 dark:from-blue-900/20 dark:to-green-900/20 rounded-lg">
            <Users className="h-4 w-4 text-blue-600 flex-shrink-0" />
            <p className="text-xs text-gray-700 dark:text-gray-300">
              Create or join groups to plan with friends and family
            </p>
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-100 to-blue-100 dark:from-purple-900/30 dark:to-blue-900/30 rounded-lg p-3 text-center">
          <p className="text-xs text-gray-700 dark:text-gray-300 mb-1">
            <strong>Have fun planning your festival!</strong>
          </p>
          <p className="text-xs text-gray-600 dark:text-gray-400">
            The more you vote, the better your group recommendations will be.
          </p>
        </div>
      </div>

      {/* Button - fixed at bottom */}
      <div className="pt-4 mt-4 border-t">
        <Button
          onClick={handleComplete}
          className="w-full"
          size="lg"
          disabled={updateProfileMutation.isPending}
        >
          <span>
            {updateProfileMutation.isPending
              ? "Setting up..."
              : "Start Exploring"}
          </span>
          <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}
