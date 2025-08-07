# Admin Routing Structure

This document describes the new nested routing structure for the admin section of the Boom Voter application.

## Overview

The admin section has been refactored from a single component with parameter-based conditional rendering to a proper nested routing structure using React Router's `Outlet` component. This provides better separation of concerns, improved maintainability, and cleaner code organization.

## Route Structure

### Main Admin Layout

- **Path**: `/admin`
- **Component**: `AdminLayout`
- **Purpose**: Handles authentication, permissions, and provides the common admin header and navigation tabs

### Admin Dashboard (Artists Management)

- **Path**: `/admin` (index) or `/admin/artists`
- **Component**: `AdminDashboard`
- **Purpose**: Manages artists and their information

### Content Management

- **Path**: `/admin/content`
- **Component**: `AdminContent`
- **Purpose**: Add new artists and genres to the system

### Analytics (Super Admin Only)

- **Path**: `/admin/analytics`
- **Component**: `AdminAnalytics`
- **Purpose**: View platform analytics and statistics

### Admin Roles (Super Admin Only)

- **Path**: `/admin/admins`
- **Component**: `AdminRoles`
- **Purpose**: Manage admin permissions and roles

### Festival Management

- **Path**: `/admin/festivals`
- **Component**: `AdminFestivals`
- **Purpose**: Overview of all festivals

#### Individual Festival Management

- **Path**: `/admin/festivals/:festivalId`
- **Component**: `FestivalDetail`
- **Purpose**: Manage a specific festival and its editions

#### Festival Edition Management

- **Path**: `/admin/festivals/:festivalId/editions/:editionId`
- **Component**: `FestivalEdition`
- **Purpose**: Manage stages and sets within a festival edition

##### Stage Management

- **Path**: `/admin/festivals/:festivalId/editions/:editionId/stages`
- **Component**: `FestivalStages`
- **Purpose**: Manage stages within a festival edition

##### Set Management

- **Path**: `/admin/festivals/:festivalId/editions/:editionId/sets`
- **Component**: `FestivalSets`
- **Purpose**: Manage sets within a festival edition

## Component Structure

```
src/pages/
├── AdminLayout.tsx              # Main admin layout with navigation
└── admin/
    ├── AdminDashboard.tsx       # Artists management
    ├── AdminContent.tsx         # Add artists/genres
    ├── AdminAnalytics.tsx       # Analytics (super admin)
    ├── AdminRoles.tsx           # Admin roles (super admin)
    ├── AdminFestivals.tsx       # Festival overview
    ├── FestivalDetail.tsx       # Individual festival management
    ├── FestivalEdition.tsx      # Edition management with tabs
    ├── FestivalStages.tsx       # Stage management
    └── FestivalSets.tsx         # Set management
```

## Key Features

### Authentication & Permissions

- All admin routes are protected by the `AdminLayout` component
- Users must have `edit_artists` permission to access admin
- Super admin features (analytics, admin roles) require `is_admin` permission
- Automatic redirect to home page if unauthorized

### Navigation

- Tab-based navigation for main admin sections
- Nested tabs for festival edition management (stages/sets)
- URL-based state management for deep linking
- Automatic tab highlighting based on current route

### URL Structure

The new routing structure provides clean, RESTful URLs:

- `/admin` - Main dashboard
- `/admin/festivals` - Festival overview
- `/admin/festivals/123` - Manage festival with ID 123
- `/admin/festivals/123/editions/456/stages` - Manage stages for edition 456
- `/admin/festivals/123/editions/456/sets` - Manage sets for edition 456

## Migration from Old Structure

### Old Routes (Removed)

```typescript
<Route path="/admin" element={<Admin />} />
<Route path="/admin/:tab" element={<Admin />} />
<Route path="/admin/festivals/:festivalId" element={<Admin />} />
<Route path="/admin/festivals/:festivalId/:editionId/:subtab" element={<Admin />} />
```

### New Routes

```typescript
<Route path="/admin" element={<AdminLayout />}>
  <Route index element={<AdminDashboard />} />
  <Route path="artists" element={<AdminDashboard />} />
  <Route path="content" element={<AdminContent />} />
  <Route path="analytics" element={<AdminAnalytics />} />
  <Route path="admins" element={<AdminRoles />} />
  <Route path="festivals" element={<AdminFestivals />} />
  <Route path="festivals/:festivalId" element={<FestivalDetail />} />
  <Route path="festivals/:festivalId/editions/:editionId" element={<FestivalEdition />}>
    <Route index element={<FestivalStages />} />
    <Route path="stages" element={<FestivalStages />} />
    <Route path="sets" element={<FestivalSets />} />
  </Route>
</Route>
```

## Benefits

1. **Better Separation of Concerns**: Each admin section has its own component
2. **Cleaner Routing**: Proper nested routes instead of parameter-based conditional rendering
3. **Better Maintainability**: Easier to understand and modify individual sections
4. **Improved Performance**: Only the relevant component renders for each route
5. **Better Type Safety**: Route parameters are properly typed
6. **Easier Testing**: Each component can be tested independently
7. **Better Code Organization**: Admin-related components are grouped together
8. **Deep Linking**: Users can bookmark and share specific admin pages
9. **Browser Navigation**: Back/forward buttons work correctly

## Future Enhancements

- Add breadcrumb navigation for deep nested routes
- Implement route-based code splitting for better performance
- Add route guards for specific admin permissions
- Consider adding a dashboard overview with quick stats
