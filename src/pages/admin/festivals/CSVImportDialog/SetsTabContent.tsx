import { FileUploadSection } from "./FileUploadSection";
import { TimezoneSelector } from "./TimezoneSelector";

interface SetsTabContentProps {
  setsFile: File | null;
  timezone: string;
  onSetsFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onTimezoneChange: (timezone: string) => void;
}

export function SetsTabContent({
  setsFile,
  timezone,
  onSetsFileChange,
  onTimezoneChange,
}: SetsTabContentProps) {
  return (
    <div className="space-y-4">
      <FileUploadSection
        id="sets-file"
        label="Sets CSV"
        file={setsFile}
        expectedColumns="artist_names, stage_name, name (optional), time_start (optional), time_end (optional), description (optional)"
        onFileChange={onSetsFileChange}
        additionalInfo={
          <div className="mt-2 text-xs text-muted-foreground space-y-1">
            <p>
              • <strong>artist_names</strong>: Comma-separated artist names
              (e.g., "Shpongle,Ott" or just "Shpongle")
            </p>
            <p>
              • <strong>name</strong>: Optional set name. If empty, will
              auto-generate from artists
            </p>
            <p>• Artists will be created automatically if they don't exist</p>
          </div>
        }
      />

      <TimezoneSelector value={timezone} onValueChange={onTimezoneChange} />
    </div>
  );
}
