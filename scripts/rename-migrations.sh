#!/bin/bash

# Script to rename migration files with descriptive names

echo "🔄 Renaming migration files to follow Supabase naming convention..."

cd supabase/migrations

# Function to get descriptive name based on file content
get_migration_name() {
    local file="$1"
    local content=$(head -20 "$file" | tr '[:upper:]' '[:lower:]')
    
    # Check for common patterns in the migration content
    if echo "$content" | grep -q "create table.*artists"; then
        echo "create_artists_table"
    elif echo "$content" | grep -q "create table.*votes"; then
        echo "create_votes_table"
    elif echo "$content" | grep -q "create table.*profiles"; then
        echo "create_profiles_table"
    elif echo "$content" | grep -q "create table.*music_genres"; then
        echo "create_music_genres_table"
    elif echo "$content" | grep -q "create table.*groups"; then
        echo "create_groups_table"
    elif echo "$content" | grep -q "create table.*admin_roles"; then
        echo "create_admin_roles_table"
    elif echo "$content" | grep -q "alter table.*add column"; then
        echo "add_columns"
    elif echo "$content" | grep -q "insert into.*artists"; then
        echo "seed_artists_data"
    elif echo "$content" | grep -q "insert into.*music_genres"; then
        echo "seed_genres_data"
    elif echo "$content" | grep -q "create.*function"; then
        echo "create_functions"
    elif echo "$content" | grep -q "create.*policy"; then
        echo "create_rls_policies"
    elif echo "$content" | grep -q "enable.*row level security"; then
        echo "enable_rls"
    elif echo "$content" | grep -q "create.*trigger"; then
        echo "create_triggers"
    elif echo "$content" | grep -q "alter.*replica identity"; then
        echo "setup_realtime"
    elif echo "$content" | grep -q "update.*artists"; then
        echo "update_artists_data"
    elif echo "$content" | grep -q "fix.*search_path"; then
        echo "fix_search_path_security"
    else
        echo "migration"
    fi
}

# Rename each migration file
for file in *.sql; do
    if [[ -f "$file" ]]; then
        # Extract timestamp (first 14 characters)
        timestamp=$(echo "$file" | cut -c1-14)
        
        # Get descriptive name
        name=$(get_migration_name "$file")
        
        # Create new filename
        new_filename="${timestamp}_${name}.sql"
        
        # Rename the file
        if [[ "$file" != "$new_filename" ]]; then
            echo "Renaming: $file -> $new_filename"
            mv "$file" "$new_filename"
        fi
    fi
done

echo "✅ Migration files renamed successfully!"
echo ""
echo "📋 New migration files:"
ls -la *.sql | head -10
echo "..." 