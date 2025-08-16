import { Button } from "@/components/ui/button";
import {
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Users, Plus, Eye, ArrowLeft } from "lucide-react";
import { OnboardingContent } from "../OnboardingContent";
import groupsImage from "./groups.png?url";
interface GroupsExplanationStepProps {
  onNext: () => void;
  onPrevious: () => void;
  onSkip?: () => void;
}

export function GroupsExplanationStep({
  onNext,
  onPrevious,
  onSkip,
}: GroupsExplanationStepProps) {
  return (
    <div className="flex flex-col h-full">
      {/* Header - fixed */}
      <DialogHeader>
        <DialogTitle className="flex items-center space-x-2">
          <Users className="h-5 w-5" />
          <span>Festival Groups</span>
        </DialogTitle>
        <DialogDescription>
          Groups let you collaborate with friends to plan your festival
          experience together.
        </DialogDescription>
      </DialogHeader>

      <OnboardingContent>
        <div className="rounded-lg overflow-hidden">
          <img
            src={groupsImage}
            alt="Groups feature showing collaborative planning"
            className="w-full h-auto max-h-56 sm:max-h-60 object-contain rounded-lg"
          />
        </div>

        <div className="space-y-3">
          <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-1">
              <Plus className="h-4 w-4 text-purple-600" />
              <h4 className="font-medium text-sm sm:text-base text-purple-900 dark:text-purple-100">
                Create Groups
              </h4>
            </div>
            <p className="text-xs sm:text-sm text-purple-700 dark:text-purple-300">
              Make groups with your friends to coordinate your plans.
            </p>
          </div>

          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-1">
              <Eye className="h-4 w-4 text-blue-600" />
              <h4 className="font-medium text-sm text-blue-900 dark:text-blue-100">
                See Group Votes
              </h4>
            </div>
            <p className="text-xs text-blue-700 dark:text-blue-300">
              View how your group rates different artists and find the shows
              everyone wants to see.
            </p>
          </div>

          <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-1">
              <Users className="h-4 w-4 text-green-600" />
              <h4 className="font-medium text-sm text-green-900 dark:text-green-100">
                Group Planning
              </h4>
            </div>
            <p className="text-xs text-green-700 dark:text-green-300">
              Share notes and coordinate meetup spots for the shows you want to
              see together.
            </p>
          </div>
        </div>
      </OnboardingContent>

      {/* Navigation - fixed at bottom */}
      <div className="flex flex-col gap-2 pt-4 mt-4 border-t">
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={onPrevious}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          {onSkip && (
            <Button
              variant="ghost"
              onClick={onSkip}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              Skip
            </Button>
          )}
          <Button onClick={onNext} className="ml-auto">
            Next: Voting
          </Button>
        </div>
      </div>
    </div>
  );
}
