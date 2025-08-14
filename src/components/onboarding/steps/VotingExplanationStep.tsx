import { Button } from "@/components/ui/button";
import {
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Heart, Star, X, ArrowLeft } from "lucide-react";
import votingImage from "./voting.png?url";
interface VotingExplanationStepProps {
  onNext: () => void;
  onPrevious: () => void;
}

export function VotingExplanationStep({
  onNext,
  onPrevious,
}: VotingExplanationStepProps) {
  return (
    <div className="flex flex-col h-full">
      {/* Header - fixed */}
      <DialogHeader>
        <DialogTitle className="flex items-center space-x-2">
          <Heart className="h-5 w-5" />
          <span>Voting System</span>
        </DialogTitle>
        <DialogDescription>
          Rate artists to help plan your festival and see what your groups
          think!
        </DialogDescription>
      </DialogHeader>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto space-y-4 mt-4 min-h-0">
        {/* Voting system screenshot */}
        <div className="rounded-lg overflow-hidden">
          <img
            src={votingImage}
            alt="Voting system showing Must Go, Interested, and Won't Go options"
            className="w-full h-auto rounded-lg"
          />
        </div>

        {/* Vote Types */}
        <div className="space-y-3">
          <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-3">
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0">
                <Heart className="h-3 w-3 text-white" />
              </div>
              <div>
                <h4 className="font-medium text-sm text-green-900 dark:text-green-100">
                  Must Go
                </h4>
                <p className="text-xs text-green-700 dark:text-green-300">
                  Artists you absolutely can't miss (+2 points)
                </p>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3">
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                <Star className="h-3 w-3 text-white" />
              </div>
              <div>
                <h4 className="font-medium text-sm text-blue-900 dark:text-blue-100">
                  Interested
                </h4>
                <p className="text-xs text-blue-700 dark:text-blue-300">
                  Artists you'd like to see if there's time (+1 point)
                </p>
              </div>
            </div>
          </div>

          <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-3">
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 bg-red-600 rounded-full flex items-center justify-center flex-shrink-0">
                <X className="h-3 w-3 text-white" />
              </div>
              <div>
                <h4 className="font-medium text-sm text-red-900 dark:text-red-100">
                  Won't Go
                </h4>
                <p className="text-xs text-red-700 dark:text-red-300">
                  Artists you'd prefer to skip (-1 point)
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-3">
          <p className="text-sm text-purple-700 dark:text-purple-300">
            <strong>Pro tip:</strong> Your votes help create group ratings so
            you can quickly see which artists your friends are excited about!
          </p>
        </div>
      </div>

      {/* Navigation - fixed at bottom */}
      <div className="flex gap-2 pt-4 mt-4 border-t">
        <Button
          variant="outline"
          onClick={onPrevious}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
        <Button onClick={onNext} className="flex-1">
          Next: Timeline
        </Button>
      </div>
    </div>
  );
}
