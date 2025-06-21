import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Users } from "lucide-react";
import { useGroups } from "@/hooks/useGroups";

interface GroupSelectorProps {
  selectedGroupId?: string;
  onGroupChange: (groupId: string | undefined) => void;
}

export const GroupSelector = ({ selectedGroupId, onGroupChange }: GroupSelectorProps) => {
  const { groups, loading } = useGroups();

  if (loading) {
    return (
      <div className="flex items-center space-x-2">
        <Users className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm text-muted-foreground">Loading groups...</span>
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-2">
      <Users className="h-4 w-4 text-muted-foreground" />
      <Select
        value={selectedGroupId || "all"}
        onValueChange={(value) => onGroupChange(value === "all" ? undefined : value)}
      >
        <SelectTrigger className="w-[180px] bg-white/10 border-purple-400/30 text-white">
          <SelectValue placeholder="All votes" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All votes</SelectItem>
          {groups.map((group) => (
            <SelectItem key={group.id} value={group.id}>
              {group.name} ({group.member_count})
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};