-- Storage policies for 'assignments' bucket
-- Allow students to upload to their own folder and read their files
CREATE POLICY "Students can upload their own assignment files"
  ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = 'assignments'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Students can read their own assignment files"
  ON storage.objects
  FOR SELECT TO authenticated
  USING (
    bucket_id = 'assignments'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- Allow mentors/HOD/Principal to read all assignment files
CREATE POLICY "Reviewers can read all assignment files"
  ON storage.objects
  FOR SELECT TO authenticated
  USING (
    bucket_id = 'assignments'
    AND (
      public.has_role(auth.uid(), 'mentor')
      OR public.has_role(auth.uid(), 'hod')
      OR public.has_role(auth.uid(), 'principal')
    )
  );