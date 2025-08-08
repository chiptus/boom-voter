interface StageLabelsProps {
  stages: Array<{ name: string }>;
}

export function StageLabels({ stages }: StageLabelsProps) {
  return (
    <div className="absolute left-4 top-16 z-20 space-y-20">
      {stages.map((stage) => (
        <div key={stage.name} className="h-20 flex items-center">
          <div className="text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-blue-600 px-2 py-1 rounded">
            {stage.name}
          </div>
        </div>
      ))}
    </div>
  );
}
