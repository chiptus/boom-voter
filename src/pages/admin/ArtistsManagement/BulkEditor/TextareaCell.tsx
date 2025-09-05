import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";

interface TextareaCellProps {
  value: string | null;
  placeholder?: string;
  onSave: (value: string | null) => void;
}

export function TextareaCell({
  value,
  placeholder,
  onSave,
}: TextareaCellProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState("");

  function handleEdit() {
    setEditValue(value || "");
    setIsEditing(true);
  }

  function handleSave() {
    onSave(editValue.trim() || null);
    setIsEditing(false);
  }

  function handleCancel() {
    setIsEditing(false);
    setEditValue("");
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Escape") {
      handleCancel();
    }
  }

  if (isEditing) {
    return (
      <div className="min-w-32">
        <Textarea
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onBlur={handleSave}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="min-h-16 text-sm"
          autoFocus
        />
      </div>
    );
  }

  return (
    <div
      className="cursor-pointer hover:bg-gray-50 p-1 rounded min-h-6 text-sm"
      onClick={handleEdit}
      title="Click to edit"
    >
      {value || (
        <span className="text-muted-foreground italic">
          {placeholder || "Click to add..."}
        </span>
      )}
    </div>
  );
}
