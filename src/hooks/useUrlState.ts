import { useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';

export type SortOption = 'name-asc' | 'name-desc' | 'rating-desc' | 'popularity-desc' | 'date-asc';
export type ScheduleViewOption = 'grid' | 'list' | 'horizontal';

export interface FilterSortState {
  sort: SortOption;
  stages: string[];
  genres: string[];
  minRating: number;
  view: 'grid' | 'list';
  scheduleView: ScheduleViewOption;
  use24Hour: boolean;
  groupId?: string;
  invite?: string;
  sortLocked?: boolean;
}

const defaultState: FilterSortState = {
  sort: 'popularity-desc',
  stages: [],
  genres: [],
  minRating: 0,
  view: 'list',
  scheduleView: 'horizontal',
  use24Hour: true,
  groupId: undefined,
  invite: undefined,
  sortLocked: false,
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
      scheduleView: (searchParams.get('scheduleView') as ScheduleViewOption) || defaultState.scheduleView,
      use24Hour: searchParams.get('use24Hour') === 'true' || defaultState.use24Hour,
      groupId: searchParams.get('groupId') || defaultState.groupId,
      invite: searchParams.get('invite') || defaultState.invite,
      sortLocked: searchParams.get('sortLocked') === 'true' || defaultState.sortLocked,
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
    if (newState.scheduleView !== defaultState.scheduleView) {
      newParams.set('scheduleView', newState.scheduleView);
    }
    if (newState.use24Hour !== defaultState.use24Hour) {
      newParams.set('use24Hour', newState.use24Hour.toString());
    }
    if (newState.groupId) {
      newParams.set('groupId', newState.groupId);
    }
    if (newState.invite) {
      newParams.set('invite', newState.invite);
    }
    if (newState.sortLocked) {
      newParams.set('sortLocked', newState.sortLocked.toString());
    }
    
    setSearchParams(newParams, { replace: true });
  }, [getStateFromUrl, setSearchParams]);

  const clearFilters = useCallback(() => {
    const currentState = getStateFromUrl();
    const newParams = new URLSearchParams();
    
    // Keep invite parameter when clearing filters
    if (currentState.invite) {
      newParams.set('invite', currentState.invite);
    }
    
    setSearchParams(newParams, { replace: true });
  }, [getStateFromUrl, setSearchParams]);

  return {
    state: getStateFromUrl(),
    updateUrlState,
    clearFilters,
  };
};
