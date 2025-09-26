import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface TimezoneSelectorProps {
  value: string;
  onValueChange: (value: string) => void;
}

export function TimezoneSelector({
  value,
  onValueChange,
}: TimezoneSelectorProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="timezone-select">Timezone</Label>
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger>
          <SelectValue placeholder="Select timezone" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="Europe/Lisbon">Europe/Lisbon</SelectItem>
          <SelectItem value="Europe/Madrid">Europe/Madrid</SelectItem>
          <SelectItem value="Europe/London">Europe/London</SelectItem>
          <SelectItem value="America/New_York">America/New_York</SelectItem>
          <SelectItem value="America/Los_Angeles">
            America/Los_Angeles
          </SelectItem>
          <SelectItem value="UTC">UTC</SelectItem>
        </SelectContent>
      </Select>
      <p className="text-xs text-muted-foreground">
        Select the timezone that the CSV times are in
      </p>
    </div>
  );
}
