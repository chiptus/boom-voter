interface VerticalStageLabelsProps {
  stages: Array<{ name: string }>;
}

export function VerticalStageLabels({ stages }: VerticalStageLabelsProps) {
  return (
    <div className="absolute top-4 left-16 z-20 flex space-x-16">
      {stages.map((stage) => (
        <div key={stage.name} className="w-20 flex justify-center">
          <div className="text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-blue-600 px-2 py-1 rounded">
            {stage.name}
          </div>
        </div>
      ))}
    </div>
  );
}