-- Create support tickets table
CREATE TABLE public.support_tickets (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id uuid NOT NULL,
  subject text NOT NULL,
  description text NOT NULL,
  status text NOT NULL DEFAULT 'open',
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.support_tickets ENABLE ROW LEVEL SECURITY;

-- Students can create their own tickets
CREATE POLICY "Students can create tickets"
ON public.support_tickets
FOR INSERT
WITH CHECK (auth.uid() = student_id AND has_role(auth.uid(), 'student'::app_role));

-- Students can view their own tickets
CREATE POLICY "Students can view own tickets"
ON public.support_tickets
FOR SELECT
USING (auth.uid() = student_id OR has_role(auth.uid(), 'hod'::app_role) OR has_role(auth.uid(), 'principal'::app_role));

-- Trigger for updated_at
CREATE TRIGGER update_support_tickets_updated_at
BEFORE UPDATE ON public.support_tickets
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();