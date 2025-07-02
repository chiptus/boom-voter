# Boom Festival Artist Voting App - Knowledge Base

## Application Overview

**Purpose**: A collaborative voting platform for Boom Festival attendees to vote on their favorite artists and make collective decisions about the festival lineup.

**Target Users**: 
- Festival attendees who want to influence the artist lineup
- Core team members who manage the festival and artist data
- Group organizers who want to create voting communities

**Value Proposition**: Enables democratic decision-making for festival lineups through group-based voting, artist discovery, and social features.

## Technical Architecture

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

## Core Features

### 1. Artist Management
- **Add Artists**: Core team members can add new artists with details (name, genre, description, stage, Spotify/SoundCloud URLs)
- **Edit Artists**: Modify artist information including images and performance details
- **Archive Artists**: Soft delete artists while preserving votes and data
- **Artist Discovery**: Browse artists with rich metadata and social links
- **Image Management**: Artist images with fallback handling

### 2. Voting System
- **Vote Types**: 
  - `2` = "Must Go" (highest priority)
  - `1` = "Interested" (medium priority) 
  - `-1` = "Won't Go" (negative vote)
- **Vote Management**: Users can change or remove votes
- **Real-time Updates**: Vote counts update instantly across all users
- **Group-filtered Voting**: Votes can be filtered by group membership
- **Weighted Scoring**: Popularity calculated as `(2 × Must Go) + Interested`

### 3. Group System
- **Group Creation**: Users can create voting groups for coordinated decision-making
- **Invite System**: Secure token-based invitations with expiration and usage limits
- **Role Management**: Group creators have administrative privileges
- **Group-filtered Data**: View voting results filtered by group membership
- **Permissions**: Core group members have elevated privileges for artist management

### 4. Artist Notes System
- **Collaborative Notes**: Users can add personal notes about artists
- **Note Sharing**: Notes are visible to group members for collaboration
- **Rich Editing**: Support for detailed artist descriptions and personal thoughts
- **Privacy**: Notes follow group-based visibility rules

### 5. Authentication & Authorization
- **Magic Link Authentication**: Passwordless login via email
- **OTP Backup**: 6-digit verification codes as fallback
- **Profile Management**: User profiles with customizable usernames
- **Invite Integration**: Seamless signup flow for group invitations
- **Role-based Permissions**: Different access levels for Core team vs regular users

### 6. Filtering & Discovery
- **Multiple Filter Types**:
  - Music Genre filtering
  - Stage filtering  
  - Minimum rating threshold
  - Group membership filtering
- **Sorting Options**:
  - Alphabetical (A-Z, Z-A)
  - Rating (highest first)
  - Popularity (weighted score)
  - Performance date
- **View Modes**: Grid view (cards) and List view
- **Real-time Search**: Instant filtering and sorting

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

## User Experience

### Key UX Features
- **Responsive Design**: Mobile-first approach with desktop enhancement
- **Dark Theme**: Purple/blue gradient design optimized for festival branding
- **Real-time Feedback**: Instant vote updates and live collaboration
- **Intuitive Voting**: Clear visual feedback for vote states and counts
- **Smart Onboarding**: Username setup flow for new users
- **Group Discovery**: Easy group joining via shareable invite links

### Navigation Patterns
- Main dashboard with filtering and artist browsing
- Individual artist detail pages with comprehensive information
- Group management interface for creators
- Profile management for user settings

### Visual Design
- Festival-themed purple/blue gradient backgrounds
- Semi-transparent cards with backdrop blur effects
- Semantic color system for consistent theming
- Icon-based navigation with clear visual hierarchy

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

## Unique Features

### Democratic Festival Planning
- Weighted voting system that prioritizes "Must Go" choices
- Group-based consensus building for friend groups
- Collaborative note-taking for artist research

### Festival-Specific Features
- Stage and time slot management for logistics
- Genre-based discovery for music exploration
- Social proof through group voting patterns

### Technical Innovation
- Seamless invite-based onboarding flow
- Real-time collaborative features
- Progressive enhancement from anonymous to authenticated usage

## Future Enhancement Opportunities

### Potential Features
- Artist recommendation engine based on voting patterns
- Integration with festival scheduling systems
- Social features like friend connections
- Advanced analytics for festival organizers
- Mobile app development
- Artist popularity predictions based on historical data

### Technical Improvements
- Enhanced caching strategies
- Offline support for mobile users
- Push notifications for group activities
- Advanced search with full-text indexing
- Performance monitoring and analytics