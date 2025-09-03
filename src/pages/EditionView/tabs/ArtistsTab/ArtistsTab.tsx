import { FilterSortControls } from "./filters/FilterSortControls";
import { useSetFiltering } from "./useSetFiltering";
import { useUrlState } from "@/hooks/useUrlState";
import { SetsPanel } from "./SetsPanel";
import { useSetsByEditionQuery } from "@/hooks/queries/sets/useSetsByEdition";
import { useFestivalEdition } from "@/contexts/FestivalEditionContext";

export function ArtistsTab() {
  const { state: urlState, updateUrlState, clearFilters } = useUrlState();
  const { edition } = useFestivalEdition();

  // Fetch sets for the current edition
  const { data: sets = [], isLoading: setsLoading } = useSetsByEditionQuery(
    edition?.id,
  );
  const { filteredAndSortedSets, lockCurrentOrder } = useSetFiltering(
    sets || [],
    urlState,
  );

  if (setsLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-white text-xl">Loading artists...</div>
      </div>
    );
  }

  return (
    <div>
      <FilterSortControls
        state={urlState}
        onStateChange={updateUrlState}
        onClear={clearFilters}
        editionId={edition?.id || ""}
      />

      <div className="mt-8">
        <SetsPanel
          sets={filteredAndSortedSets}
          use24Hour={urlState.use24Hour}
          onLockSort={() => lockCurrentOrder(updateUrlState)}
        />
      </div>
    </div>
  );
}
