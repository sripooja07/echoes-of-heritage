-- Create a secure function to promote users to admin (only callable by admins)
CREATE OR REPLACE FUNCTION public.promote_user_to_admin(_target_user_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Check if the calling user is an admin
  IF NOT public.has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'Only admins can promote users';
  END IF;
  
  -- Check if target user already has admin role
  IF public.has_role(_target_user_id, 'admin') THEN
    RETURN false; -- Already an admin
  END IF;
  
  -- Update existing role to admin or insert new admin role
  UPDATE public.user_roles 
  SET role = 'admin'::app_role 
  WHERE user_id = _target_user_id;
  
  -- If no row was updated, the user doesn't have any role yet
  IF NOT FOUND THEN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (_target_user_id, 'admin'::app_role);
  END IF;
  
  RETURN true;
END;
$$;

-- Create a secure function to demote users from admin (only callable by admins)
CREATE OR REPLACE FUNCTION public.demote_admin_to_user(_target_user_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Check if the calling user is an admin
  IF NOT public.has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'Only admins can demote users';
  END IF;
  
  -- Prevent self-demotion
  IF auth.uid() = _target_user_id THEN
    RAISE EXCEPTION 'Cannot demote yourself';
  END IF;
  
  -- Update role to user
  UPDATE public.user_roles 
  SET role = 'user'::app_role 
  WHERE user_id = _target_user_id AND role = 'admin'::app_role;
  
  RETURN FOUND;
END;
$$;

-- Add policy for admins to view all profiles (needed for user management)
CREATE POLICY "Admins can view all profiles" 
ON public.profiles 
FOR SELECT 
USING (has_role(auth.uid(), 'admin'::app_role));