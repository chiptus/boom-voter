import { parseMarkdown } from "@/lib/markdown";
import { getTextAlignmentClasses } from "@/lib/textAlignment";

interface InfoTextProps {
  infoText?: string;
}

export function InfoText({ infoText }: InfoTextProps) {
  const htmlContent = infoText ? parseMarkdown(infoText) : "";
  const alignmentClasses = infoText ? getTextAlignmentClasses(infoText) : "";

  return (
    <div className="bg-white/5 rounded-lg p-6">
      <div
        className={`prose prose-invert max-w-none text-purple-100 ${alignmentClasses}`}
        dangerouslySetInnerHTML={{ __html: htmlContent }}
      />
    </div>
  );
}
