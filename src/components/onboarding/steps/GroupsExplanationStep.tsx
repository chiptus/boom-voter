import { Button } from "@/components/ui/button";
import {
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Users, Plus, Eye, ArrowLeft } from "lucide-react";

interface GroupsExplanationStepProps {
  onNext: () => void;
  onPrevious: () => void;
}

export function GroupsExplanationStep({
  onNext,
  onPrevious,
}: GroupsExplanationStepProps) {
  return (
    <>
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

      <div className="space-y-4 mt-4">
        {/* Placeholder for screenshot */}
        <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 text-center">
          <p className="text-xs text-gray-600 dark:text-gray-400">
            📸 Groups feature screenshot placeholder
          </p>
        </div>

        {/* Visual Examples */}
        <div className="space-y-3">
          <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-1">
              <Plus className="h-4 w-4 text-purple-600" />
              <h4 className="font-medium text-sm text-purple-900 dark:text-purple-100">
                Create Groups
              </h4>
            </div>
            <p className="text-xs text-purple-700 dark:text-purple-300">
              Make groups with your friends, family, or fellow festival-goers to
              coordinate your plans.
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

        {/* Navigation */}
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={onPrevious}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <Button onClick={onNext} className="flex-1">
            Next: Voting System
          </Button>
        </div>
      </div>
    </>
  );
}
