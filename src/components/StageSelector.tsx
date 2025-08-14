import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useStagesQuery } from "@/hooks/queries/stages/useStages";

export function StageSelector({
  value,
  onValueChange,
}: {
  value: string;
  onValueChange: (value: string) => void;
}) {
  const { data: stages = [], isLoading } = useStagesQuery();

  return (
    <div className="space-y-2">
      <Label htmlFor="stage">Stage</Label>
      <Select value={value} onValueChange={onValueChange} disabled={isLoading}>
        <SelectTrigger>
          <SelectValue
            placeholder={isLoading ? "Loading stages..." : "Select a stage"}
          />
        </SelectTrigger>
        <SelectContent>
          {stages.map((stage) => (
            <SelectItem key={stage.id} value={stage.id}>
              {stage.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
