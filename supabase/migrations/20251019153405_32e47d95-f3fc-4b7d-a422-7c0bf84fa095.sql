-- Allow mentors to mark assignments as reviewed
CREATE POLICY "Mentors can mark assignments reviewed"
ON public.assignments
FOR UPDATE
USING (has_role(auth.uid(), 'mentor'))
WITH CHECK (has_role(auth.uid(), 'mentor') AND status = 'reviewed');

-- Allow HOD to approve or reject reviewed assignments
CREATE POLICY "HOD can approve or reject reviewed assignments"
ON public.assignments
FOR UPDATE
USING (has_role(auth.uid(), 'hod'))
WITH CHECK (has_role(auth.uid(), 'hod') AND (status = 'approved' OR status = 'rejected'));
