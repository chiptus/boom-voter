# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Essential Commands

### Development

- `npm run dev` - Start development server on port 8080 (DO NOT RUN - user always has dev server running)
- `npm run build` - Production build
- `npm run build:dev` - Development build
- `npm run lint` - Run oxlint
- `npm run preview` - Preview production build

### Testing

- `npm run test:e2e` - Run Playwright end-to-end tests
- `npm run test:e2e:ui` - Run tests with Playwright UI
- `npm run test:e2e:headed` - Run tests in headed mode
- `npm run test:e2e:debug` - Debug tests
- `npm run test:e2e:report` - Show test report
- `npm run test:setup` - Setup test environment
- `npm run test:setup:full` - Setup full local Supabase

## Architecture Overview

### Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **UI**: shadcn/ui components with Radix UI primitives
- **Styling**: Tailwind CSS with custom design system
- **Database**: Supabase PostgreSQL with Row Level Security
- **State Management**: TanStack Query for server state
- **Authentication**: Supabase Auth (magic links + OTP)
- **Testing**: Playwright for E2E tests

### Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # shadcn/ui base components
│   ├── Admin/          # Admin dashboard components
│   ├── ArtistDetail/   # Artist detail page components
│   ├── Index/          # Main page components
│   └── legal/          # Legal pages (privacy, terms)
├── hooks/              # Custom React hooks
│   ├── queries/        # TanStack Query hooks
│   └── useAuth.ts      # Authentication logic
├── integrations/
│   └── supabase/       # Supabase client and types
├── lib/                # Utility functions
├── pages/              # Route components
├── services/           # Business logic services
└── types/              # TypeScript type definitions
```

### Core Application Concepts

**UpLine** is a collaborative festival voting platform with these key features:

1. **Artist Management**: Core team can add/edit artists with genres, stages, and metadata
2. **Voting System**: Three vote types - "Must Go" (2), "Interested" (1), "Won't Go" (-1)
3. **Group System**: Users can create groups for collaborative decision-making
4. **Real-time Updates**: Live vote counts and artist changes via Supabase subscriptions
5. **Authentication**: Passwordless login with magic links and OTP backup

### Database Schema

- `artists` - Artist information with genres, stages, performance times
- `votes` - User votes linked to artists and groups
- `artist_notes` - Collaborative notes visible to group members
- `groups` - Voting groups with invite system
- `group_members` - Group membership with roles
- `profiles` - Extended user information

### Key Architectural Patterns

1. **Component Architecture**: Functional components with TypeScript, using custom hooks for business logic
2. **State Management**: Server state via TanStack Query, URL state for filters, local state for UI
3. **Real-time Features**: Supabase subscriptions for live updates
4. **Security**: Row Level Security policies, role-based permissions (Anonymous, Authenticated, Group Creator, Core Team)
5. **Offline Support**: PWA configuration with service worker caching

### Development Guidelines

1. **TypeScript**: Full type coverage with generated Supabase types
2. **Styling**: Use Tailwind utilities and existing component patterns
3. **Components**: Follow shadcn/ui patterns for new UI components
4. **Data Fetching**: Use TanStack Query hooks in `hooks/queries/`
5. **Authentication**: Use `useAuth` hook for auth state and actions
6. **Routing**: Add new routes to `App.tsx` above the catch-all "\*" route

### Testing Setup

- E2E tests use Playwright with local Supabase instance
- Tests run against port 8080 (development server)
- Test data setup via `scripts/setup-test-env.sh`
- CI/CD runs tests in parallel across multiple browsers
- Detailed testing documentation in `tests/README.md`

### Code Conventions

- oxlint configuration with TypeScript and React rules
- React hooks follow standard patterns
- Component files use PascalCase
- Custom hooks use camelCase with "use" prefix
- Services and utilities use camelCase
- **Function Style**: Always use function declarations (`function name() {}`) instead of arrow function expressions (`const name = () => {}`) for components and named functions
- **Query Hook Naming**: Query hooks must end with "Query" (e.g., `useGroupsQuery`, `useUserPermissionsQuery`) and mutation hooks must end with "Mutation" (e.g., `useUpdateGroupMutation`, `useCreateArtistMutation`)
- **Dialog Components**: Always include both `DialogTitle` AND `DialogDescription` in `DialogHeader` to prevent accessibility warnings
- **React Router**: Use future flags `v7_startTransition` and `v7_relativeSplatPath` in BrowserRouter to prepare for v7 upgrade
- **Component Extraction**: When a section of JSX + logic becomes substantial (>30 lines) or reusable, extract it into a separate component. Place in appropriate directory: page-specific components in `components/PageName/`, reusable ones in `components/`
- **Forms**: ALL forms must use react-hook-form with proper validation. Never use plain HTML forms or manual state management for form inputs. Use @hookform/resolvers for validation schemas when needed.
- **Long Components**: Break long components (>150 lines) into smaller focused pieces. Follow the FilterSortControls pattern of primary controls + expandable sections.

#### Function Definitions After Return in React Components

In this codebase, it is acceptable and preferred to define helper functions (such as event handlers) after the main component’s return statement. This style improves readability by keeping the primary component logic at the top and allowing additional details to be found below. JavaScript and TypeScript support function hoisting for function declarations, so this pattern is safe and intentional. Please do not flag this as a style issue in reviews.

### Important Notes

- Server runs on port 8080 (not standard 3000)
- Authentication uses magic links primarily, OTP as backup
- All database operations go through Supabase RLS policies
- Group-based permissions affect data visibility
- PWA manifest configured for "UpLine" branding

- dont use export from unless specifically required

- try to use mutation.mutate(variables, {onSuccess, onError}) instead of try{await mutation.mutateAsync(variables)}catch(err){}

- don't add comments unless really necessary

## Git Workflow

- **Auto-commit Rule**: For every user message that requests code changes, automatically commit the changes after implementation with an appropriate commit message
