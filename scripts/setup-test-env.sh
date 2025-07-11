#!/bin/bash

# Setup script for local Supabase test environment

echo "🚀 Setting up local Supabase test environment..."

# Check if Supabase CLI is installed
if ! command -v supabase &> /dev/null; then
    echo "❌ Supabase CLI not found. Please install it first:"
    echo "   npm install -g supabase"
    exit 1
fi

# Start local Supabase
echo "📦 Starting local Supabase..."
supabase start

# Wait for Supabase to be ready
echo "⏳ Waiting for Supabase to be ready..."
sleep 10

# Run migrations
echo "🔄 Running database migrations..."
supabase db reset

# Get the local credentials
echo "🔑 Getting local Supabase credentials..."
supabase status
