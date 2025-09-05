import { CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Grid3X3, RotateCcw, Save, Plus, Copy } from "lucide-react";
import { Link } from "react-router-dom";

interface BulkEditorHeaderProps {
  totalChanges: number;
  onAddArtist: () => void;
  onResetChanges: () => void;
  onSaveChanges: () => void;
}

export function BulkEditorHeader({
  totalChanges,
  onAddArtist,
  onResetChanges,
  onSaveChanges,
}: BulkEditorHeaderProps) {
  return (
    <CardHeader>
      <CardTitle className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Grid3X3 className="h-5 w-5 text-blue-600" />
          <span>Artists Management</span>
          {totalChanges > 0 && (
            <Badge
              variant="secondary"
              className="bg-orange-100 text-orange-800"
            >
              {totalChanges} changes
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Link to="/admin/artists/duplicates">
            <Button
              variant="outline"
              size="sm"
              className="text-orange-600 hover:text-orange-700"
            >
              <Copy className="h-4 w-4 mr-1" />
              <span className="hidden md:block">Manage Duplicates</span>
            </Button>
          </Link>

          <Button
            onClick={onAddArtist}
            size="sm"
            className="bg-purple-600 hover:bg-purple-700"
          >
            <Plus className="h-4 w-4 mr-1" />
            <span className="hidden md:block">Add Artist</span>
          </Button>

          {totalChanges > 0 && (
            <>
              <Button variant="outline" size="sm" onClick={onResetChanges}>
                <RotateCcw className="h-4 w-4 mr-1" />
                Reset
              </Button>
              <Button
                size="sm"
                onClick={onSaveChanges}
                className="bg-green-600 hover:bg-green-700"
              >
                <Save className="h-4 w-4 mr-1" />
                Save Changes
              </Button>
            </>
          )}
        </div>
      </CardTitle>
    </CardHeader>
  );
}
