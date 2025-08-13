# Query Structure Migration Guide

## Status: Phase 1 Complete ✅

We've successfully created the new query hook structure but still need to migrate existing imports.

## What's Done ✅

- Created organized directory structure with individual hooks
- All major CRUD operations for groups, artists, sets, voting, and auth
- Proper error handling, query invalidation, and optimistic updates
- Backwards compatibility through re-exports

## What's Left 🚧

### High Priority (Breaks React Query patterns)

Files using `queryFunctions` directly instead of hooks:

```bash
# These bypass React Query entirely - highest priority
grep -l "queryFunctions\." src/**/*.{ts,tsx}
```

### Medium Priority (Type imports)

Files importing types from old location:

```bash
# These just need import path updates
grep -l "import.*{.*}.*from.*services/queries" src/**/*.{ts,tsx}
```

### Low Priority (Query keys)

Files importing query key factories:

```bash
# These work but should eventually use new locations
grep -l "artistQueries\|setQueries\|groupQueries" src/**/*.{ts,tsx}
```

## Migration Pattern

**Before (bad - bypasses React Query):**

```ts
import { queryFunctions } from "@/services/queries";

// Direct function call - no caching, no reactivity
const data = await queryFunctions.fetchArtists();
```

**After (good - uses React Query properly):**

```ts
import { useArtists } from "@/hooks/queries/artists/useArtists";

// React Query hook - cached, reactive, error handling
const { data, isLoading, error } = useArtists();
```

## Next Steps

1. Fix files using `queryFunctions` directly (15 files)
2. Fix files using `mutationFunctions` directly (4 files)
3. Update type imports gradually
4. Update query key imports gradually
5. Remove `services/queries.ts` file

## Commands

```bash
# Find problematic direct function usage
rg "queryFunctions\.|mutationFunctions\." --type ts

# Find type import usage
rg "import.*from.*services/queries" --type ts

# Find query key usage
rg "artistQueries\.|setQueries\.|groupQueries\." --type ts
```
