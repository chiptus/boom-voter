import { Button } from "@/components/ui/button";
import {
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Calendar, Clock, MapPin, ArrowLeft } from "lucide-react";

interface TimelineExplanationStepProps {
  onNext: () => void;
  onPrevious: () => void;
}

export function TimelineExplanationStep({
  onNext,
  onPrevious,
}: TimelineExplanationStepProps) {
  return (
    <>
      <DialogHeader>
        <DialogTitle className="flex items-center space-x-2">
          <Calendar className="h-5 w-5" />
          <span>Festival Timeline</span>
        </DialogTitle>
        <DialogDescription>
          See when and where your favorite artists are performing to plan your
          festival schedule.
        </DialogDescription>
      </DialogHeader>

      <div className="space-y-6 mt-4">
        {/* Placeholder for screenshot */}
        <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-8 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            📸 Timeline feature screenshot placeholder
          </p>
        </div>

        {/* Timeline Features */}
        <div className="space-y-4">
          <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="h-4 w-4 text-orange-600" />
              <h4 className="font-medium text-orange-900 dark:text-orange-100">
                Schedule View
              </h4>
            </div>
            <p className="text-sm text-orange-700 dark:text-orange-300">
              See all sets laid out chronologically across stages to spot
              conflicts and plan your route.
            </p>
          </div>

          <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <MapPin className="h-4 w-4 text-indigo-600" />
              <h4 className="font-medium text-indigo-900 dark:text-indigo-100">
                Stage Layout
              </h4>
            </div>
            <p className="text-sm text-indigo-700 dark:text-indigo-300">
              Visual timeline shows which stage each artist is performing on and
              when.
            </p>
          </div>

          <div className="bg-teal-50 dark:bg-teal-900/20 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="h-4 w-4 text-teal-600" />
              <h4 className="font-medium text-teal-900 dark:text-teal-100">
                Coming Soon
              </h4>
            </div>
            <p className="text-sm text-teal-700 dark:text-teal-300">
              The timeline appears once the festival publishes set times. Until
              then, browse and vote on artists!
            </p>
          </div>
        </div>

        <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-3">
          <p className="text-sm text-purple-700 dark:text-purple-300">
            <strong>Planning tip:</strong> Vote on artists now so the timeline
            will highlight your favorites when it's available!
          </p>
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
            Almost Done!
          </Button>
        </div>
      </div>
    </>
  );
}
