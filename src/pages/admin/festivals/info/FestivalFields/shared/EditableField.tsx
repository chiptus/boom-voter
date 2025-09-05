import { useState, ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Edit } from "lucide-react";

interface EditableFieldProps {
  title: string;
  children: ReactNode;
  renderEdit: (props: {
    onCancel: () => void;
    onSave: () => void;
  }) => ReactNode;
}

export function EditableField({
  title,
  children,
  renderEdit,
}: EditableFieldProps) {
  const [isEditing, setIsEditing] = useState(false);

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <h4 className="font-medium">{title}</h4>
        {!isEditing && (
          <Button
            onClick={() => setIsEditing(true)}
            variant="ghost"
            size="sm"
            title={`Edit ${title}`}
          >
            <Edit className="h-3 w-3" />
            <span className="sr-only">Edit</span>
          </Button>
        )}
      </div>

      {isEditing
        ? renderEdit({ onCancel: handleCancel, onSave: handleSave })
        : children}
    </div>
  );

  function handleCancel() {
    return setIsEditing(false);
  }
  function handleSave() {
    return setIsEditing(false);
  }
}
