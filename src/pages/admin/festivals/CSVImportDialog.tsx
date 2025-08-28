import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Upload, FileText, Loader2 } from "lucide-react";
import {
  importStages,
  importSets,
  parseStagesCSV,
  parseSetsCSV,
  type ImportResult,
} from "@/services/csvImportService";
import { useQueryClient } from "@tanstack/react-query";

interface CSVImportDialogProps {
  editionId: string;
  children: React.ReactNode;
  defaultTab?: "stages" | "sets";
}

export function CSVImportDialog({
  editionId,
  children,
  defaultTab = "stages",
}: CSVImportDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [stagesFile, setStagesFile] = useState<File | null>(null);
  const [setsFile, setSetsFile] = useState<File | null>(null);
  const [timezone, setTimezone] = useState("Europe/Lisbon");
  const [progress, setProgress] = useState({ current: 0, total: 0, label: "" });
  const { toast } = useToast();
  const queryClient = useQueryClient();

  function handleFileChange(
    event: React.ChangeEvent<HTMLInputElement>,
    type: "stages" | "sets",
  ) {
    const file = event.target.files?.[0];
    if (file && file.type === "text/csv") {
      if (type === "stages") {
        setStagesFile(file);
      } else {
        setSetsFile(file);
      }
    } else {
      toast({
        title: "Invalid file",
        description: "Please select a CSV file",
        variant: "destructive",
      });
    }
  }

  function readFileAsText(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target?.result as string);
      reader.onerror = reject;
      reader.readAsText(file);
    });
  }

  async function handleImport() {
    if (!stagesFile && !setsFile) {
      toast({
        title: "No files selected",
        description: "Please select at least one CSV file to import",
        variant: "destructive",
      });
      return;
    }

    setIsImporting(true);
    const results: ImportResult[] = [];

    try {
      // Import stages first
      if (stagesFile) {
        setProgress({ current: 0, total: 0, label: "Importing stages..." });
        const stagesContent = await readFileAsText(stagesFile);
        const stagesData = parseStagesCSV(stagesContent);

        const stagesResult = await importStages(
          stagesData,
          editionId,
          (current, total) => {
            setProgress({
              current,
              total,
              label: `Importing stages (${current}/${total})...`,
            });
          },
        );
        results.push(stagesResult);
      }

      // Then import sets (which reference stages)
      if (setsFile) {
        setProgress({ current: 0, total: 0, label: "Importing sets..." });
        const setsContent = await readFileAsText(setsFile);
        const setsData = parseSetsCSV(setsContent);

        const setsResult = await importSets(
          setsData,
          editionId,
          timezone,
          (current, total) => {
            setProgress({
              current,
              total,
              label: `Importing sets (${current}/${total})...`,
            });
          },
        );
        results.push(setsResult);
      }

      // Show results
      const successCount = results.filter((r) => r.success).length;
      const failureCount = results.filter((r) => !r.success).length;

      if (successCount > 0 && failureCount === 0) {
        toast({
          title: "Import successful",
          description: results.map((r) => r.message).join(". "),
        });

        // Refresh data
        queryClient.invalidateQueries({ queryKey: ["stages"] });
        queryClient.invalidateQueries({ queryKey: ["sets"] });

        // Reset form
        setStagesFile(null);
        setSetsFile(null);
        setProgress({ current: 0, total: 0, label: "" });
        setIsOpen(false);
      } else {
        toast({
          title: "Import completed with issues",
          description: results.map((r) => r.message).join(". "),
          variant: failureCount > 0 ? "destructive" : "default",
        });
      }
    } catch (error) {
      toast({
        title: "Import failed",
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive",
      });
    } finally {
      setIsImporting(false);
      setProgress({ current: 0, total: 0, label: "" });
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Import CSV Data</DialogTitle>
          <DialogDescription>
            Upload CSV files to import stages and sets for this festival
            edition.
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue={defaultTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="stages">Stages</TabsTrigger>
            <TabsTrigger value="sets">Sets</TabsTrigger>
          </TabsList>

          <TabsContent value="stages" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="stages-file">Stages CSV</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="stages-file"
                  type="file"
                  accept=".csv"
                  onChange={(e) => handleFileChange(e, "stages")}
                  className="file:mr-2 file:px-4 file:py-2 file:rounded file:border-0 file:text-sm file:font-medium file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
                />
                {stagesFile && (
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <FileText size={16} />
                    {stagesFile.name}
                  </div>
                )}
              </div>
              <p className="text-sm text-muted-foreground">
                Expected columns: name
              </p>
            </div>
          </TabsContent>

          <TabsContent value="sets" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="sets-file">Sets CSV</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="sets-file"
                  type="file"
                  accept=".csv"
                  onChange={(e) => handleFileChange(e, "sets")}
                  className="file:mr-2 file:px-4 file:py-2 file:rounded file:border-0 file:text-sm file:font-medium file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
                />
                {setsFile && (
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <FileText size={16} />
                    {setsFile.name}
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="timezone-select">Timezone</Label>
                <Select value={timezone} onValueChange={setTimezone}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select timezone" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Europe/Lisbon">Europe/Lisbon</SelectItem>
                    <SelectItem value="Europe/Madrid">Europe/Madrid</SelectItem>
                    <SelectItem value="Europe/London">Europe/London</SelectItem>
                    <SelectItem value="America/New_York">
                      America/New_York
                    </SelectItem>
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
              <p className="text-sm text-muted-foreground">
                Expected columns: artist_names, stage_name, name (optional),
                time_start (optional), time_end (optional), description
                (optional)
              </p>
              <div className="mt-2 text-xs text-muted-foreground space-y-1">
                <p>
                  • <strong>artist_names</strong>: Comma-separated artist names
                  (e.g., "Shpongle,Ott" or just "Shpongle")
                </p>
                <p>
                  • <strong>name</strong>: Optional set name. If empty, will
                  auto-generate from artists
                </p>
                <p>
                  • Artists will be created automatically if they don't exist
                </p>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {isImporting && progress.total > 0 && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>{progress.label}</span>
              <span>
                {Math.round((progress.current / progress.total) * 100)}%
              </span>
            </div>
            <Progress value={(progress.current / progress.total) * 100} />
          </div>
        )}

        <div className="flex justify-end gap-2 pt-4">
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleImport}
            disabled={isImporting || (!stagesFile && !setsFile)}
          >
            {isImporting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {progress.label || "Importing..."}
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                Import
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
