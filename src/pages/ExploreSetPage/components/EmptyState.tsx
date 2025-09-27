import { Button } from "@/components/ui/button";
import { ArrowLeft, Link } from "lucide-react";

interface EmptyStateProps {
  basePath: string;
}

export function EmptyState({ basePath }: EmptyStateProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-900 to-black flex flex-col items-center justify-center p-4">
      <div className="text-white text-center">
        <h1 className="text-2xl font-bold mb-4">No Sets Available</h1>
        <p className="mb-6">
          You have explored all available sets in this edition
        </p>
        <Link to={basePath}>
          <Button asChild variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Go Back
          </Button>
        </Link>
      </div>
    </div>
  );
}
