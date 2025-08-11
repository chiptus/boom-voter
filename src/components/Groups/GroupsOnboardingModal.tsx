import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Users, Heart, MessageCircle } from "lucide-react";

interface GroupsOnboardingModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function GroupsOnboardingModal({
  open,
  onOpenChange,
}: GroupsOnboardingModalProps) {
  const navigate = useNavigate();
  const [dismissed, setDismissed] = useState(false);

  function handleCreateGroup() {
    onOpenChange(false);
    navigate("/groups");
  }

  function handleMaybeLater() {
    setDismissed(true);
    onOpenChange(false);
    // Store in localStorage to not show again for this session
    localStorage.setItem("groupsOnboardingDismissed", "true");
  }

  if (dismissed) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg">
            <Users className="h-5 w-5 text-purple-400" />
            Vote with Friends!
          </DialogTitle>
          <DialogDescription className="text-left space-y-4 pt-2">
            <p>
              Make festival planning more fun by creating groups with your
              friends.
            </p>

            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <Heart className="h-4 w-4 text-pink-400 mt-0.5 flex-shrink-0" />
                <span className="text-sm">
                  See combined group votes and discover what everyone's excited
                  about
                </span>
              </div>

              <div className="flex items-start gap-3">
                <MessageCircle className="h-4 w-4 text-blue-400 mt-0.5 flex-shrink-0" />
                <span className="text-sm">
                  Add notes and discuss artists with your group members
                </span>
              </div>

              <div className="flex items-start gap-3">
                <Users className="h-4 w-4 text-purple-400 mt-0.5 flex-shrink-0" />
                <span className="text-sm">
                  Invite friends with a simple link - no separate signups needed
                </span>
              </div>
            </div>
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-2 pt-4">
          <Button
            onClick={handleCreateGroup}
            className="bg-purple-600 hover:bg-purple-700"
          >
            Create My First Group
          </Button>
          <Button
            variant="ghost"
            onClick={handleMaybeLater}
            className="text-muted-foreground hover:text-foreground"
          >
            Maybe Later
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
