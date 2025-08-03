#!/bin/bash

# Comprehensive local Supabase setup script

echo "🚀 Setting up local Supabase environment..."

# Check if Supabase CLI is installed
if ! command -v supabase &> /dev/null; then
    echo "❌ Supabase CLI not found. Please install it first:"
    echo "   npm install -g supabase"
    exit 1
fi

# Check if Docker is running
if ! docker info &> /dev/null; then
    echo "❌ Docker is not running. Please start Docker first."
    exit 1
fi

# Stop any existing Supabase instance
echo "🛑 Stopping any existing Supabase instances..."
supabase stop 2>/dev/null || true

# Start local Supabase
echo "📦 Starting local Supabase..."
supabase start

# Wait for Supabase to be ready
echo "⏳ Waiting for Supabase to be ready..."
sleep 15

# Check if Supabase is running
if ! supabase status &> /dev/null; then
    echo "❌ Failed to start Supabase. Please check Docker and try again."
    exit 1
fi

# Run migrations
echo "🔄 Running database migrations..."
supabase db reset

# Verify migrations
echo "✅ Verifying database schema..."
supabase db diff --schema public
