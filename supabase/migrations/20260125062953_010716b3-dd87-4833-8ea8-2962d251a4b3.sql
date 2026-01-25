-- Drop the existing policy that allows any role
DROP POLICY IF EXISTS "Users can insert their own role on signup" ON public.user_roles;

-- Create a new policy that only allows inserting 'user' role
CREATE POLICY "Users can insert their own role on signup" 
ON public.user_roles 
FOR INSERT 
WITH CHECK (auth.uid() = user_id AND role = 'user'::app_role);