import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

interface EmptyStateProps {
  onGoBack: () => void;
}

export function EmptyState({ onGoBack }: EmptyStateProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-900 to-black flex flex-col items-center justify-center p-4">
      <div className="text-white text-center">
        <h1 className="text-2xl font-bold mb-4">No Sets Available</h1>
        <p className="mb-6">
          There are no sets to explore for this festival edition.
        </p>
        <Button onClick={onGoBack} variant="outline">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Go Back
        </Button>
      </div>
    </div>
  );
}
