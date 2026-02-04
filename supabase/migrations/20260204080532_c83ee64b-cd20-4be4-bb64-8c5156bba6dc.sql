-- Create a trigger function to auto-promote specific emails to admin
CREATE OR REPLACE FUNCTION public.auto_promote_admin()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Check if the new user's email should be auto-promoted to admin
  IF NEW.email IN ('srichowdary7309@gmail.com', 'sripoojachintala@gmail.com') THEN
    -- Update the role to admin (the user_role is already created by handle_new_user_role trigger)
    UPDATE public.user_roles 
    SET role = 'admin'::app_role 
    WHERE user_id = NEW.id;
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create trigger that runs AFTER the user role is created
-- Using a higher priority (AFTER INSERT) to ensure it runs after handle_new_user_role
CREATE TRIGGER on_auth_user_created_promote_admin
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.auto_promote_admin();