-- Add INSERT policy for user_roles to allow users to set their role during signup
CREATE POLICY "Users can insert own role on signup" 
ON public.user_roles 
FOR INSERT 
TO authenticated
WITH CHECK (auth.uid() = user_id);