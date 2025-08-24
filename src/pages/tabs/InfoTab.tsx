import { useFestivalEdition } from "@/contexts/FestivalEditionContext";

export function InfoTab() {
  const { edition } = useFestivalEdition();

  return (
    <>
      <div className="text-center space-y-2 md:space-y-4">
        <p className="text-lg md:text-xl text-purple-200 font-medium mb-2 md:mb-4">
          {edition?.name}
        </p>
      </div>
      <div className="text-center text-purple-300 py-12">
        <p>Festival info coming soon!</p>
      </div>
    </>
  );
}
