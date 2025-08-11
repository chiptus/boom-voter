import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Trash2, Crown } from "lucide-react";

export function GroupCard({
  group,
  onView,
  onDelete,
  onLeave,
}: {
  group: any;
  onView: () => void;
  onDelete: () => void;
  onLeave: () => void;
}) {
  return (
    <Card className="bg-white/10 border-purple-400/30">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="flex items-center space-x-2 text-white">
              <span>{group.name}</span>
              {group.is_creator && (
                <Badge
                  variant="secondary"
                  className="text-xs bg-purple-600/50 text-purple-100"
                >
                  <Crown className="h-3 w-3 mr-1" />
                  Creator
                </Badge>
              )}
            </CardTitle>
            {group.description && (
              <CardDescription className="mt-1 text-purple-200">
                {group.description}
              </CardDescription>
            )}
          </div>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onView}
              className="bg-white/10 border-purple-400/30 text-white hover:bg-white/20"
            >
              <Users className="h-4 w-4" />
            </Button>
            {group.is_creator ? (
              <Button variant="destructive" size="sm" onClick={onDelete}>
                <Trash2 className="h-4 w-4" />
              </Button>
            ) : (
              <Button
                variant="outline"
                size="sm"
                onClick={onLeave}
                className="bg-white/10 border-purple-400/30 text-white hover:bg-white/20"
              >
                Leave
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-sm text-purple-200">
            <Users className="h-4 w-4" />
            <span>{group.member_count} members</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
