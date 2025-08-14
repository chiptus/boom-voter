import { Button } from "@/components/ui/button";
import {
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Calendar, Clock, MapPin, ArrowLeft } from "lucide-react";

import image from "./timeline.png?url"; // Assuming you have this image in the same directory

interface TimelineExplanationStepProps {
  onNext: () => void;
  onPrevious: () => void;
}

export function TimelineExplanationStep({
  onNext,
  onPrevious,
}: TimelineExplanationStepProps) {
  return (
    <div className="flex flex-col h-full">
      {/* Header - fixed */}
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

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto space-y-4 mt-4 min-h-0">
        {/* Timeline feature screenshot */}
        <div className="rounded-lg overflow-hidden">
          <img
            src={image}
            alt="Timeline feature showing festival schedule and stage layout"
            className="w-full h-auto rounded-lg"
          />
        </div>

        {/* Timeline Features */}
        <div className="space-y-3">
          <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-1">
              <Clock className="h-4 w-4 text-orange-600" />
              <h4 className="font-medium text-sm text-orange-900 dark:text-orange-100">
                Schedule View
              </h4>
            </div>
            <p className="text-xs text-orange-700 dark:text-orange-300">
              See all sets laid out chronologically across stages to spot
              conflicts and plan your route.
            </p>
          </div>

          <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-1">
              <MapPin className="h-4 w-4 text-indigo-600" />
              <h4 className="font-medium text-sm text-indigo-900 dark:text-indigo-100">
                Stage Layout
              </h4>
            </div>
            <p className="text-xs text-indigo-700 dark:text-indigo-300">
              Visual timeline shows which stage each artist is performing on and
              when.
            </p>
          </div>

          <div className="bg-teal-50 dark:bg-teal-900/20 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-1">
              <Calendar className="h-4 w-4 text-teal-600" />
              <h4 className="font-medium text-sm text-teal-900 dark:text-teal-100">
                Coming Soon
              </h4>
            </div>
            <p className="text-xs text-teal-700 dark:text-teal-300">
              The timeline appears once the festival publishes set times. Until
              then, browse and vote on artists!
            </p>
          </div>
        </div>

        <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-3">
          <p className="text-xs text-purple-700 dark:text-purple-300">
            <strong>Planning tip:</strong> Vote on artists now so the timeline
            will highlight your favorites when it's available!
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
          Almost Done!
        </Button>
      </div>
    </div>
  );
}
