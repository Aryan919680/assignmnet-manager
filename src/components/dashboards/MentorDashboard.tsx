import { useState, useEffect } from "react";
import { User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/Badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import { FileText, User as UserIcon } from "lucide-react";

interface Assignment {
  id: string;
  title: string;
  description: string;
  status: string;
  created_at: string;
  file_path: string;
  student_id: string;
  profiles: { full_name: string; email: string };
}

interface MentorDashboardProps {
  user: User;
}

export default function MentorDashboard({ user }: MentorDashboardProps) {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);
  const [marks, setMarks] = useState("");
  const [comments, setComments] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchAssignments();
  }, []);

  const fetchAssignments = async () => {
    const { data } = await supabase
      .from("assignments")
      .select(`
        *,
        profiles!assignments_student_id_fkey (full_name, email)
      `)
      .in("status", ["pending", "rejected"])
      .order("created_at", { ascending: false });

    if (data) setAssignments(data as any);
  };

  const handleReview = async () => {
    if (!selectedAssignment || !marks) {
      toast.error("Please enter marks");
      return;
    }

    setLoading(true);

    try {
      const { error: reviewError } = await supabase.from("reviews").insert({
        assignment_id: selectedAssignment.id,
        reviewer_id: user.id,
        reviewer_role: "mentor",
        marks: parseInt(marks),
        comments,
        action: "reviewed",
      });

      if (reviewError) throw reviewError;

      const { error: updateError } = await supabase
        .from("assignments")
        .update({ status: "mentor_review" })
        .eq("id", selectedAssignment.id);

      if (updateError) throw updateError;

      toast.success("Review submitted successfully!");
      setSelectedAssignment(null);
      setMarks("");
      setComments("");
      fetchAssignments();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold">Mentor Dashboard</h2>
        <p className="text-muted-foreground">Review student assignments</p>
      </div>

      <div className="grid gap-4">
        {assignments.map((assignment) => (
          <Card key={assignment.id} className="border-border/50 transition-colors hover:border-primary/30">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">{assignment.title}</CardTitle>
                  <CardDescription className="mt-1">{assignment.description}</CardDescription>
                  <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                    <UserIcon className="h-4 w-4" />
                    <span>{assignment.profiles.full_name} ({assignment.profiles.email})</span>
                  </div>
                </div>
                <Badge variant="warning">Needs Review</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <FileText className="h-4 w-4" />
                  <span>Submitted on {new Date(assignment.created_at).toLocaleDateString()}</span>
                </div>
                <Button onClick={() => setSelectedAssignment(assignment)}>Review</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={!!selectedAssignment} onOpenChange={() => setSelectedAssignment(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Review Assignment</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="marks">Marks (out of 100)</Label>
              <Input
                id="marks"
                type="number"
                min="0"
                max="100"
                value={marks}
                onChange={(e) => setMarks(e.target.value)}
                placeholder="Enter marks"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="comments">Comments</Label>
              <Textarea
                id="comments"
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                placeholder="Add your feedback"
                rows={4}
              />
            </div>
            <Button onClick={handleReview} disabled={loading} className="w-full">
              {loading ? "Submitting..." : "Submit Review"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
