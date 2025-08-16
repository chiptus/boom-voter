-- Add completed_onboarding column to profiles table
ALTER TABLE profiles 
ADD COLUMN completed_onboarding BOOLEAN DEFAULT FALSE;

