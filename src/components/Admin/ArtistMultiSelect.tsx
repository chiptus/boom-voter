import { MultiSelect } from "../ui/multi-select";

interface Artist {
  id: string;
  name: string;
}

interface ArtistMultiSelectProps {
  artists: Artist[];
  value: string[];
  onValueChange: (value: string[]) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

export function ArtistMultiSelect({
  artists,
  value,
  onValueChange,
  placeholder = "Select artists...",
  disabled = false,
  className,
}: ArtistMultiSelectProps) {
  return (
    <MultiSelect
      options={artists}
      value={value}
      onValueChange={onValueChange}
      placeholder={placeholder}
      searchPlaceholder="Search artists..."
      emptyMessage="No artists found."
      disabled={disabled}
      className={className}
    />
  );
}
