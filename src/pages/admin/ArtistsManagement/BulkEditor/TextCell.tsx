import { useState } from "react";
import { Input } from "@/components/ui/input";

interface TextCellProps {
  value: string | null;
  placeholder?: string;
  required?: boolean;
  onSave: (value: string | null) => void;
}

export function TextCell({
  value,
  placeholder,
  required,
  onSave,
}: TextCellProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState("");

  function handleEdit() {
    setEditValue(value || "");
    setIsEditing(true);
  }

  function handleSave() {
    if (required && !editValue.trim()) {
      return;
    }

    onSave(editValue.trim() || null);
    setIsEditing(false);
  }

  function handleCancel() {
    setIsEditing(false);
    setEditValue("");
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter") {
      handleSave();
    } else if (e.key === "Escape") {
      handleCancel();
    }
  }

  if (isEditing) {
    return (
      <div className="min-w-32">
        <Input
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onBlur={handleSave}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="text-sm"
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
