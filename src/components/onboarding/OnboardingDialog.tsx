import { useState, useEffect } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { User } from "@supabase/supabase-js";
import { UsernameStep } from "./steps/UsernameStep";
import { GroupsExplanationStep } from "./steps/GroupsExplanationStep";
import { VotingExplanationStep } from "./steps/VotingExplanationStep";
import { TimelineExplanationStep } from "./steps/TimelineExplanationStep";
import { WelcomeStep } from "./steps/WelcomeStep";
import { useAuth } from "@/contexts/AuthContext";

export type OnboardingStep =
  | "username"
  | "groups"
  | "voting"
  | "timeline"
  | "welcome";

interface OnboardingDialogProps {
  open: boolean;
  user: User;
  onComplete: () => void;
}

export function OnboardingDialog({
  open,
  user,
  onComplete,
}: OnboardingDialogProps) {
  const { profile } = useAuth();
  const [currentStep, setCurrentStep] = useState<OnboardingStep>("username");
  const [username, setUsername] = useState("");

  // Set initial step based on whether user has username
  useEffect(() => {
    if (profile?.username && profile.username.trim() !== "") {
      if (currentStep === "username") {
        setCurrentStep("groups");
        setUsername(profile.username);
      }
    } else {
      setCurrentStep("username");
    }
  }, [profile, currentStep]);

  function handleNext() {
    const steps: OnboardingStep[] = [
      "username",
      "groups",
      "voting",
      "timeline",
      "welcome",
    ];
    const currentIndex = steps.indexOf(currentStep);

    if (currentIndex < steps.length - 1) {
      setCurrentStep(steps[currentIndex + 1]);
    } else {
      onComplete();
    }
  }

  function handlePrevious() {
    const steps: OnboardingStep[] = [
      "username",
      "groups",
      "voting",
      "timeline",
      "welcome",
    ];
    const currentIndex = steps.indexOf(currentStep);

    if (currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1]);
    }
  }

  function renderStep() {
    switch (currentStep) {
      case "username":
        return (
          <UsernameStep
            user={user}
            username={username}
            setUsername={setUsername}
            onNext={handleNext}
          />
        );
      case "groups":
        return (
          <GroupsExplanationStep
            onNext={handleNext}
            onPrevious={handlePrevious}
          />
        );
      case "voting":
        return (
          <VotingExplanationStep
            onNext={handleNext}
            onPrevious={handlePrevious}
          />
        );
      case "timeline":
        return (
          <TimelineExplanationStep
            onNext={handleNext}
            onPrevious={handlePrevious}
          />
        );
      case "welcome":
        return <WelcomeStep username={username} onComplete={onComplete} />;
      default:
        return null;
    }
  }

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent
        className="sm:max-w-lg max-h-[95vh] w-[95vw] sm:w-full h-[95vh] sm:h-auto flex flex-col p-6"
        onInteractOutside={(e) => e.preventDefault()}
      >
        {renderStep()}
      </DialogContent>
    </Dialog>
  );
}
