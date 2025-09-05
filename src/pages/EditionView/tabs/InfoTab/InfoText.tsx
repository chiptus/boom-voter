interface InfoTextProps {
  infoText?: string;
}

export function InfoText({ infoText }: InfoTextProps) {
  return (
    <div className="bg-white/5 rounded-lg p-6">
      <div
        className="prose prose-invert max-w-none text-purple-100"
        dangerouslySetInnerHTML={{ __html: infoText || "" }}
      />
    </div>
  );
}
