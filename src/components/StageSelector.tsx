import { STAGES } from "@/components/Index/filters/constants";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function StageSelector({ value, onValueChange }: { value: string, onValueChange: (value: string) => void }) {
    return <div className="space-y-2">
      <Label htmlFor="stage">Stage</Label>
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger>
          <SelectValue placeholder="Select a stage" />
        </SelectTrigger>
        <SelectContent>
          {STAGES.map((stage) => (
            <SelectItem key={stage} value={stage}>
              {stage}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>;
  }