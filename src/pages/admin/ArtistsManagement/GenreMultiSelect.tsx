import { MultiSelect } from "@/components/ui/multi-select";

interface Genre {
  id: string;
  name: string;
}

interface GenreMultiSelectProps {
  genres: Genre[];
  value: string[];
  onValueChange: (value: string[]) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

export function GenreMultiSelect({
  genres,
  value,
  onValueChange,
  placeholder = "Select genres...",
  disabled = false,
  className,
}: GenreMultiSelectProps) {
  return (
    <MultiSelect
      options={genres}
      value={value}
      onValueChange={onValueChange}
      placeholder={placeholder}
      searchPlaceholder="Search genres..."
      emptyMessage="No genres found."
      disabled={disabled}
      className={className}
    />
  );
}
