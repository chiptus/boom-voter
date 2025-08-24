# MutateAsync to Mutate Conversion Plan

## Overview

This document outlines the plan to convert all `mutateAsync` usage to regular `mutate` calls throughout the codebase, following the project convention that prefers `mutation.mutate(variables, {onSuccess, onError})` over `try{await mutation.mutateAsync(variables)}catch(err){}`.

## Current Status

Found **15 files** with `mutateAsync` usage across **16 instances**:

## Files to Convert

### 1. **Offline Operations** (2 files)
- `src/hooks/useOfflineVoting.ts:34`
- `src/hooks/useOfflineNotes.ts:26` 
- `src/hooks/useOfflineNotes.ts:41`

### 2. **Admin Components** (8 files)
- `src/components/Admin/FestivalManagementTable.tsx:45`
- `src/components/Admin/FestivalLogoDialog.tsx:45`
- `src/components/Admin/FestivalLogoDialog.tsx:78`
- `src/components/Admin/FestivalEditionManagement.tsx:171`
- `src/components/Admin/FestivalEditionManagement.tsx:176`
- `src/components/Admin/FestivalDialog.tsx:143`
- `src/components/Admin/FestivalDialog.tsx:148`
- `src/components/Admin/StageManagement.tsx:87`
- `src/components/Admin/StageManagement.tsx:92`
- `src/components/Admin/StageManagement.tsx:117`
- `src/components/Admin/SetFormDialog.tsx:174`
- `src/components/Admin/SetFormDialog.tsx:180`
- `src/components/Admin/SetFormDialog.tsx:193`
- `src/components/Admin/SetFormDialog.tsx:204`

### 3. **Pages** (1 file)
- `src/pages/GroupDetail.tsx:268`

### 4. **Utilities** (2 files)
- `src/components/Index/useInviteValidation.ts:67`
- `src/hooks/queries/knowledge/useKnowledge.ts:147`

## Conversion Patterns

### Pattern 1: Simple Try-Catch → onSuccess/onError

**Before:**
```typescript
try {
  await mutation.mutateAsync(variables);
  // success logic
} catch (error) {
  // error handling
}
```

**After:**
```typescript
mutation.mutate(variables, {
  onSuccess: () => {
    // success logic
  },
  onError: (error) => {
    // error handling
  }
});
```

### Pattern 2: Complex Sequential Operations

**Before:**
```typescript
try {
  const result = await mutation1.mutateAsync(data1);
  await mutation2.mutateAsync({ id: result.id, ...data2 });
  // success logic
} catch (error) {
  // error handling
}
```

**After:**
```typescript
mutation1.mutate(data1, {
  onSuccess: (result) => {
    mutation2.mutate({ id: result.id, ...data2 }, {
      onSuccess: () => {
        // success logic
      },
      onError: (error) => {
        // error handling
      }
    });
  },
  onError: (error) => {
    // error handling
  }
});
```

### Pattern 3: Multiple Sequential Mutations

For files like `SetFormDialog.tsx` with multiple sequential mutations, we'll need to chain them using nested `onSuccess` callbacks or create helper functions.

## Conversion Priority

### **High Priority** (Simple conversions)
1. `useOfflineVoting.ts` - Single mutation
2. `useOfflineNotes.ts` - Two simple mutations  
3. `FestivalManagementTable.tsx` - Single deletion
4. `StageManagement.tsx` - Create/Update/Delete operations
5. `GroupDetail.tsx` - Single remove member operation
6. `useInviteValidation.ts` - Single invite mutation
7. `useKnowledge.ts` - Single toggle mutation

### **Medium Priority** (Moderate complexity)
8. `FestivalLogoDialog.tsx` - Upload then update operations
9. `FestivalEditionManagement.tsx` - Create/Update with form reset
10. `FestivalDialog.tsx` - Create/Update with cleanup

### **Low Priority** (Complex sequential operations)
11. `SetFormDialog.tsx` - Multiple chained mutations with loops

## Benefits of Conversion

1. **Consistency** - Aligns with project conventions
2. **Better Error Handling** - Centralized in mutation hooks
3. **Cleaner Code** - No try-catch blocks needed
4. **Loading States** - Automatic `isPending` management
5. **Success Handling** - Cleaner success callback patterns

## Implementation Steps

1. **Phase 1**: Convert simple single-mutation files (High Priority)
2. **Phase 2**: Convert moderate complexity files (Medium Priority)  
3. **Phase 3**: Refactor complex sequential operations (Low Priority)
4. **Phase 4**: Test all conversions and ensure functionality remains identical

## Testing Strategy

- Verify each conversion maintains identical behavior
- Test error scenarios to ensure proper error handling
- Confirm loading states work correctly
- Check that success/cleanup logic executes as expected

## Completion Criteria

- [ ] All 16 `mutateAsync` instances converted to `mutate`
- [ ] No remaining `mutateAsync` usage in codebase
- [ ] All functionality verified to work identically
- [ ] Consistent error handling patterns across all mutations
- [ ] Code follows project conventions for mutation usage