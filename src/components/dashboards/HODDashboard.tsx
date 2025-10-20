import { useState, useEffect } from "react";
import { User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/Badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { toast } from "sonner";
import { FileText, User as UserIcon, CheckCircle, XCircle } from "lucide-react";

interface Review {
  marks: number;
  comments: string;
}

interface Assignment {
  id: string;
  title: string;
  description: string;
  status: string;
  created_at: string;
  file_path: string;
  student_id: string;
  profiles: { full_name: string; email: string };
  reviews: Review[];
}

interface HODDashboardProps {
  user: User;
}

export default function HODDashboard({ user }: HODDashboardProps) {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);
  const [comments, setComments] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchAssignments();
  }, []);

  const fetchAssignments = async () => {
    const { data: assignmentRows, error: aErr } = await supabase
      .from("assignments")
      .select("*")
      .eq("status", "reviewed")
      .order("created_at", { ascending: false });

    if (aErr) {
      toast.error(aErr.message);
      return;
    }

    if (!assignmentRows || assignmentRows.length === 0) {
      setAssignments([]);
      return;
    }

    const studentIds = Array.from(new Set(assignmentRows.map((a: any) => a.student_id)));
    const { data: profileRows, error: pErr } = await supabase
      .from("profiles")
      .select("id, full_name, email")
      .in("id", studentIds);

    if (pErr || !profileRows) {
      setAssignments(assignmentRows as any);
      return;
    }

    const assignmentIds = assignmentRows.map((a: any) => a.id);
    const { data: reviewRows, error: rErr } = await supabase
      .from("reviews")
      .select("assignment_id, marks, comments")
      .in("assignment_id", assignmentIds);

    if (rErr) {
      toast.error(rErr.message);
    }

    const profileMap = new Map(profileRows.map((p: any) => [p.id, p]));
    const reviewMap = new Map((reviewRows || []).map((r: any) => [r.assignment_id, r]));

    const enriched = (assignmentRows as any[]).map((a) => ({
      ...a,
      profiles: profileMap.get(a.student_id) || { full_name: "Unknown", email: "N/A" },
      reviews: reviewMap.has(a.id) ? [reviewMap.get(a.id)] : [],
    }));

    setAssignments(enriched as any);
  };

  const handleApprove = async () => {
    if (!selectedAssignment) return;

    setLoading(true);

    try {
      const { error: reviewError } = await supabase.from("reviews").insert({
        assignment_id: selectedAssignment.id,
        reviewer_id: user.id,
        reviewer_role: "hod",
        comments,
        action: "approved",
      });

      if (reviewError) throw reviewError;

      const { error: updateError } = await supabase
        .from("assignments")
        .update({ status: "approved" })
        .eq("id", selectedAssignment.id);

      if (updateError) throw updateError;

      toast.success("Assignment approved!");
      setSelectedAssignment(null);
      setComments("");
      fetchAssignments();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async () => {
    if (!selectedAssignment || !comments) {
      toast.error("Please add rejection comments");
      return;
    }

    setLoading(true);

    try {
      const { error: reviewError } = await supabase.from("reviews").insert({
        assignment_id: selectedAssignment.id,
        reviewer_id: user.id,
        reviewer_role: "hod",
        comments,
        action: "rejected",
      });

      if (reviewError) throw reviewError;

      const { error: updateError } = await supabase
        .from("assignments")
        .update({ status: "rejected" })
        .eq("id", selectedAssignment.id);

      if (updateError) throw updateError;

      toast.success("Assignment rejected. Student can resubmit.");
      setSelectedAssignment(null);
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
        <h2 className="text-3xl font-bold">HOD Dashboard</h2>
        <p className="text-muted-foreground">Approve or reject reviewed assignments</p>
      </div>

      {assignments.length === 0 ? (
        <Card className="border-dashed">
          <CardHeader>
            <CardTitle className="text-xl">No reviewed assignments</CardTitle>
            <CardDescription>
              There are no assignments awaiting HOD decision yet. Once mentors mark submissions as reviewed, they’ll appear here.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <Button variant="secondary" onClick={fetchAssignments}>Refresh</Button>
            </div>
          </CardContent>
        </Card>
      ) : (
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
                    {assignment.reviews[0] && (
                      <div className="mt-3 rounded-lg bg-muted/50 p-3">
                        <p className="text-sm font-semibold">Mentor Review</p>
                        <p className="text-sm text-muted-foreground">
                          Marks: {assignment.reviews[0].marks}/100
                        </p>
                        {assignment.reviews[0].comments && (
                          <p className="mt-1 text-sm text-muted-foreground">
                            {assignment.reviews[0].comments}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                  <Badge variant="warning">Awaiting Decision</Badge>
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
      )}

      <Dialog open={!!selectedAssignment} onOpenChange={() => setSelectedAssignment(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Final Review</DialogTitle>
            <DialogDescription className="sr-only">Approve or reject the assignment reviewed by mentor.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="comments">Comments (required for rejection)</Label>
              <Textarea
                id="comments"
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                placeholder="Add your feedback"
                rows={4}
              />
            </div>
            <div className="flex gap-3">
              <Button
                onClick={handleApprove}
                disabled={loading}
                className="flex-1 bg-success hover:bg-success/90"
              >
                <CheckCircle className="mr-2 h-4 w-4" />
                Approve
              </Button>
              <Button
                onClick={handleReject}
                disabled={loading}
                variant="destructive"
                className="flex-1"
              >
                <XCircle className="mr-2 h-4 w-4" />
                Reject
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
