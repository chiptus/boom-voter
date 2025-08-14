-- Add completed_onboarding column to profiles table
ALTER TABLE profiles 
ADD COLUMN completed_onboarding BOOLEAN DEFAULT FALSE;

-- For existing users who have a username, mark onboarding as completed
UPDATE profiles 
SET completed_onboarding = TRUE 
WHERE username IS NOT NULL AND username != '';

