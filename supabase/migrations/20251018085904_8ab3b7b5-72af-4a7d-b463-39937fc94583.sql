-- Ensure assignments bucket exists (creates if not exists)
INSERT INTO storage.buckets (id, name, public)
VALUES ('assignments', 'assignments', false)
ON CONFLICT (id) DO NOTHING;

-- Drop existing policies if any
DROP POLICY IF EXISTS "Students can upload assignments" ON storage.objects;
DROP POLICY IF EXISTS "Students can view own assignments" ON storage.objects;
DROP POLICY IF EXISTS "Mentors can view all assignments" ON storage.objects;
DROP POLICY IF EXISTS "HOD can view all assignments" ON storage.objects;
DROP POLICY IF EXISTS "Principal can view all assignments" ON storage.objects;

-- Students can upload their own assignments
CREATE POLICY "Students can upload assignments"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'assignments' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Students can view their own assignments
CREATE POLICY "Students can view own assignments"
ON storage.objects
FOR SELECT
TO authenticated
USING (
  bucket_id = 'assignments' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Mentors can view all assignments
CREATE POLICY "Mentors can view all assignments"
ON storage.objects
FOR SELECT
TO authenticated
USING (
  bucket_id = 'assignments' AND
  EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid() AND role = 'mentor'
  )
);

-- HOD can view all assignments
CREATE POLICY "HOD can view all assignments"
ON storage.objects
FOR SELECT
TO authenticated
USING (
  bucket_id = 'assignments' AND
  EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid() AND role = 'hod'
  )
);

-- Principal can view all assignments
CREATE POLICY "Principal can view all assignments"
ON storage.objects
FOR SELECT
TO authenticated
USING (
  bucket_id = 'assignments' AND
  EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid() AND role = 'principal'
  )
);