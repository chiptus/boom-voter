import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FileText } from "lucide-react";

interface FileUploadSectionProps {
  id: string;
  label: string;
  file: File | null;
  expectedColumns: string;
  additionalInfo?: React.ReactNode;
  onFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export function FileUploadSection({
  id,
  label,
  file,
  expectedColumns,
  additionalInfo,
  onFileChange,
}: FileUploadSectionProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <div className="flex items-center gap-2">
        <Input
          id={id}
          type="file"
          accept=".csv"
          onChange={onFileChange}
          className="file:mr-2 file:px-4 file:py-2 file:rounded file:border-0 file:text-sm file:font-medium file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
        />
        {file && (
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <FileText size={16} />
            {file.name}
          </div>
        )}
      </div>
      <p className="text-sm text-muted-foreground">
        Expected columns: {expectedColumns}
      </p>
      {additionalInfo}
    </div>
  );
}
