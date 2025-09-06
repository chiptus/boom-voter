import type { Stage } from "@/hooks/queries/stages/types";

/**
 * Sorts stages by priority: stages with order > 0 come first (sorted by order),
 * then stages with order 0 come last (sorted alphabetically by name)
 */
export function sortStagesByOrder<T extends { name: string }>(
  items: T[],
  stages: Stage[],
  getNameFromItem: (item: T) => string = (item) => item.name,
): T[] {
  return items.sort((a, b) => {
    const nameA = getNameFromItem(a);
    const nameB = getNameFromItem(b);

    const stageA = stages.find((s) => s.name === nameA);
    const stageB = stages.find((s) => s.name === nameB);
    const orderA = stageA?.stage_order ?? 0;
    const orderB = stageB?.stage_order ?? 0;

    // Stages with order > 0 come first, sorted by order
    // Stages with order 0 come last, sorted by name
    if (orderA > 0 && orderB > 0) {
      return orderA - orderB;
    }
    if (orderA > 0 && orderB === 0) {
      return -1; // A comes before B
    }
    if (orderA === 0 && orderB > 0) {
      return 1; // B comes before A
    }
    // Both are 0, sort by name
    return nameA.localeCompare(nameB);
  });
}

/**
 * Sorts stage objects directly by their stage_order and name properties
 */
export function sortStages(stages: Stage[]): Stage[] {
  return stages.sort((a, b) => {
    const orderA = a.stage_order ?? 0;
    const orderB = b.stage_order ?? 0;

    // Stages with order > 0 come first, sorted by order
    // Stages with order 0 come last, sorted by name
    if (orderA > 0 && orderB > 0) {
      return orderA - orderB;
    }
    if (orderA > 0 && orderB === 0) {
      return -1; // A comes before B
    }
    if (orderA === 0 && orderB > 0) {
      return 1; // B comes before A
    }
    // Both are 0, sort by name
    return a.name.localeCompare(b.name);
  });
}
