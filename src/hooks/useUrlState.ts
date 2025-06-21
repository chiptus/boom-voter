import { useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';

export type SortOption = 'name-asc' | 'name-desc' | 'rating-desc' | 'popularity-desc' | 'date-asc';

export interface FilterSortState {
  sort: SortOption;
  stages: string[];
  genres: string[];
  minRating: number;
  view: 'grid' | 'list';
  groupId?: string;
}

const defaultState: FilterSortState = {
  sort: 'popularity-desc',
  stages: [],
  genres: [],
  minRating: 0,
  view: 'list',
  groupId: undefined,
};

export const useUrlState = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const getStateFromUrl = useCallback((): FilterSortState => {
    return {
      sort: (searchParams.get('sort') as SortOption) || defaultState.sort,
      stages: searchParams.get('stages')?.split(',').filter(Boolean) || defaultState.stages,
      genres: searchParams.get('genres')?.split(',').filter(Boolean) || defaultState.genres,
      minRating: parseInt(searchParams.get('minRating') || '0') || defaultState.minRating,
      view: (searchParams.get('view') as 'grid' | 'list') || defaultState.view,
      groupId: searchParams.get('groupId') || defaultState.groupId,
    };
  }, [searchParams]);

  const updateUrlState = useCallback((updates: Partial<FilterSortState>) => {
    const currentState = getStateFromUrl();
    const newState = { ...currentState, ...updates };
    
    const newParams = new URLSearchParams();
    
    // Only add non-default values to URL
    if (newState.sort !== defaultState.sort) {
      newParams.set('sort', newState.sort);
    }
    if (newState.stages.length > 0) {
      newParams.set('stages', newState.stages.join(','));
    }
    if (newState.genres.length > 0) {
      newParams.set('genres', newState.genres.join(','));
    }
    if (newState.minRating > 0) {
      newParams.set('minRating', newState.minRating.toString());
    }
    if (newState.view !== defaultState.view) {
      newParams.set('view', newState.view);
    }
    if (newState.groupId) {
      newParams.set('groupId', newState.groupId);
    }
    
    setSearchParams(newParams, { replace: true });
  }, [getStateFromUrl, setSearchParams]);

  const clearFilters = useCallback(() => {
    setSearchParams(new URLSearchParams(), { replace: true });
  }, [setSearchParams]);

  return {
    state: getStateFromUrl(),
    updateUrlState,
    clearFilters,
  };
};
