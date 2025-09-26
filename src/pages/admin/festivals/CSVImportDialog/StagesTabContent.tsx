import { FileUploadSection } from "./FileUploadSection";

interface StagesTabContentProps {
  stagesFile: File | null;
  onStagesFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export function StagesTabContent({
  stagesFile,
  onStagesFileChange,
}: StagesTabContentProps) {
  return (
    <FileUploadSection
      id="stages-file"
      label="Stages CSV"
      file={stagesFile}
      expectedColumns="name"
      onFileChange={onStagesFileChange}
    />
  );
}
