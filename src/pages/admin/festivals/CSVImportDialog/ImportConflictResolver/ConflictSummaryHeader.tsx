import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, CheckCircle } from "lucide-react";
import type { ImportCandidate } from "@/services/csv/conflictDetector";

interface ConflictSummaryHeaderProps {
  conflictCount: number;
  candidatesWithoutConflicts: ImportCandidate[];
  unresolvedCount: number;
  summary: {
    skip: number;
    import_new: number;
    merge: number;
  };
}

export function ConflictSummaryHeader({
  conflictCount,
  candidatesWithoutConflicts,
  unresolvedCount,
  summary,
}: ConflictSummaryHeaderProps) {
  const totalImports = conflictCount + candidatesWithoutConflicts.length;

  return (
    <Card className="border-yellow-200 bg-yellow-50">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-yellow-600" />
          <CardTitle className="text-lg">Import Conflicts Detected</CardTitle>
        </div>
        <CardDescription>
          Found {conflictCount} potential duplicate
          {conflictCount !== 1 ? "s" : ""} out of {totalImports} import
          candidate{totalImports !== 1 ? "s" : ""}.{" "}
          {candidatesWithoutConflicts.length} artist
          {candidatesWithoutConflicts.length !== 1 ? "s" : ""} will import
          without conflicts.
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <Badge
              variant="destructive"
              className="bg-yellow-100 text-yellow-800"
            >
              {unresolvedCount} Unresolved
            </Badge>
          </div>
          {summary.skip > 0 && (
            <div className="flex items-center gap-2">
              <Badge variant="secondary">{summary.skip} Skip</Badge>
            </div>
          )}
          {summary.import_new > 0 && (
            <div className="flex items-center gap-2">
              <Badge
                variant="outline"
                className="border-blue-500 text-blue-700"
              >
                {summary.import_new} Import New
              </Badge>
            </div>
          )}
          {summary.merge > 0 && (
            <div className="flex items-center gap-2">
              <Badge
                variant="outline"
                className="border-green-500 text-green-700"
              >
                {summary.merge} Merge
              </Badge>
            </div>
          )}
          {candidatesWithoutConflicts.length > 0 && (
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <Badge
                variant="outline"
                className="border-green-500 text-green-700"
              >
                {candidatesWithoutConflicts.length} Clean Import
                {candidatesWithoutConflicts.length !== 1 ? "s" : ""}
              </Badge>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
