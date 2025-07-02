
## Technical Documentation

### Frontend Stack
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **UI Framework**: shadcn/ui components with Radix UI primitives
- **Styling**: Tailwind CSS with custom design system
- **Routing**: React Router v6
- **State Management**: TanStack Query (React Query) for server state
- **Authentication**: Supabase Auth with magic links and OTP

### Backend Infrastructure
- **Database**: Supabase PostgreSQL with Row Level Security (RLS)
- **Authentication**: Supabase Auth (magic link + OTP verification)
- **Real-time**: Supabase real-time subscriptions for live updates
- **Storage**: Supabase Storage (configured but not actively used)

### Key Technologies
- React Hook Form with Zod validation
- Lucide React icons
- Tailwind CSS with semantic color system
- Real-time updates via Supabase channels

## Database Schema

### Core Tables
- **artists**: Artist information (name, genre, stage, URLs, images, metadata)
- **votes**: User voting records with vote types and timestamps
- **artist_notes**: Collaborative notes about artists
- **artist_knowledge**: User's familiarity tracking with artists
- **music_genres**: Genre taxonomy for categorization

### Group System Tables
- **groups**: Voting groups with creators and metadata
- **group_members**: Group membership with roles and join dates
- **group_invites**: Secure invitation system with tokens and expiration

### User System Tables
- **profiles**: Extended user information beyond Supabase auth
- User authentication handled by Supabase's `auth.users` table

### Key Relationships
- Artists belong to genres (many-to-one)
- Votes link users to artists with vote types
- Notes connect users and artists with group visibility
- Groups contain multiple members with role-based permissions
- Invites enable secure group joining

## Security Model

### Row Level Security (RLS)
- **Artists**: Public read access, authenticated creation, Core team editing
- **Votes**: Public read, users can only manage their own votes  
- **Notes**: Group-based visibility and editing permissions
- **Groups**: Members can view, creators can manage
- **Profiles**: Public read access, users manage their own profiles

### Authentication Security
- Magic link authentication for secure, passwordless access
- OTP verification as backup authentication method
- Session management with automatic token refresh
- Invite token validation with expiration and usage limits

### Permission Levels
1. **Anonymous**: View artists and votes only
2. **Authenticated**: Full voting, note creation, group participation
3. **Group Creators**: Manage their groups and invitations
4. **Core Team**: Add/edit artists, administrative functions

## Integration Points

### External Services
- **Spotify**: Artist profile links and metadata
- **SoundCloud**: Alternative music platform integration
- **Email Service**: Magic link and OTP delivery via Supabase

### Real-time Features
- Vote updates broadcast instantly
- Artist additions/changes propagated live
- Group membership changes reflected immediately
- Notes visible to group members in real-time

## Development Patterns

### Code Organization
- **Custom Hooks**: Separated business logic (useAuth, useVoting, useGroups)
- **Query Management**: TanStack Query for server state with real-time subscriptions
- **Component Architecture**: Reusable UI components with clear prop interfaces
- **Type Safety**: Full TypeScript coverage with Supabase type generation

### State Management Strategy
- Server state via TanStack Query with optimistic updates
- URL state for filters and navigation
- Local component state for UI interactions
- Real-time subscriptions for live data updates

### Performance Optimizations
- Lazy loading for artist images with fallbacks
- Optimistic updates for voting interactions
- Debounced search and filtering
- Efficient real-time subscription management

## Technical Debt & Considerations

### Current Architecture Decisions
- Using magic link auth instead of social providers for simplicity
- Real-time updates via Supabase channels instead of polling
- Group-based permissions instead of complex role hierarchies
- Soft deletion for artists to preserve historical data

### Scalability Considerations
- Database queries optimized for group-filtered views
- Efficient real-time subscription patterns
- Image optimization and CDN considerations for artist photos
- Query caching strategies for frequently accessed data