import { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, Save, X } from "lucide-react";

interface EditContainerProps {
  children: ReactNode;
  onSave: () => void;
  onCancel: () => void;
  isLoading?: boolean;
  helpText?: string;
}

export function EditContainer({
  children,
  onSave,
  onCancel,
  isLoading = false,
  helpText,
}: EditContainerProps) {
  return (
    <div className="space-y-4 p-4 border rounded-lg bg-muted/50">
      {children}

      <div className="flex gap-2">
        <Button onClick={onSave} size="sm" disabled={isLoading}>
          {isLoading && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
          <Save className="h-4 w-4 mr-2" />
          Save
        </Button>
        <Button onClick={onCancel} variant="outline" size="sm">
          <X className="h-4 w-4 mr-2" />
          Cancel
        </Button>
      </div>

      {helpText && <p className="text-xs text-muted-foreground">{helpText}</p>}
    </div>
  );
}
