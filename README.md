# UpLine - Festival Artist Voting App

## Application Overview

**Purpose**: A collaborative voting platform for festival attendees to vote on their favorite artists and make collective decisions about the festival lineup.

**Target Users**:

- Festival attendees who want to influence the artist lineup
- Core team members who manage the festival and artist data
- Group organizers who want to create voting communities

**Value Proposition**: Enables democratic decision-making for festival lineups through group-based voting, artist discovery, and social features.

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

## Project History & Evolution

**Initial Development**: UpLine was originally built for Boom Festival as a proof-of-concept for collaborative festival lineup voting. The platform successfully demonstrated how communities can democratically influence artist selection through group-based voting and real-time collaboration.

## Unique Features

### Democratic Festival Planning

- Weighted voting system that prioritizes "Must Go" choices
- Group-based consensus building for friend groups
- Collaborative note-taking for artist research

### Festival-Specific Features

- Stage and time slot management for logistics
- Genre-based discovery for music exploration
- Social proof through group voting patterns

### Community Building

- Real-time collaborative features
- Seamless invite-based onboarding flow
- Progressive enhancement from anonymous to authenticated usage
