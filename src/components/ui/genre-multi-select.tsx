import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Checkbox } from "@/components/ui/checkbox";
import { ChevronsUpDown, X } from "lucide-react";

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
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          className={`w-full justify-between ${className || ""}`}
          disabled={disabled}
        >
          {value.length > 0 ? (
            <div className="flex flex-wrap gap-1">
              {value.map((genreId) => {
                const genre = genres.find((g) => g.id === genreId);
                return genre ? (
                  <Badge key={genreId} variant="secondary" className="text-xs">
                    {genre.name}
                    <span
                      className="ml-1 hover:text-red-600 cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        const newValue = value.filter((id) => id !== genreId);
                        onValueChange(newValue);
                      }}
                    >
                      <X className="h-3 w-3" />
                    </span>
                  </Badge>
                ) : null;
              })}
            </div>
          ) : (
            <span className="text-muted-foreground">{placeholder}</span>
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput placeholder="Search genres..." />
          <CommandEmpty>No genres found.</CommandEmpty>
          <CommandGroup>
            <CommandList>
              {genres.map((genre) => (
                <CommandItem
                  key={genre.id}
                  onSelect={() => {
                    const newValue = value.includes(genre.id)
                      ? value.filter((id) => id !== genre.id)
                      : [...value, genre.id];
                    onValueChange(newValue);
                  }}
                >
                  <Checkbox
                    checked={value.includes(genre.id)}
                    className="mr-2"
                  />
                  {genre.name}
                </CommandItem>
              ))}
            </CommandList>
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}