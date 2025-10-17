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
  profiles?: { full_name: string; email: string } | null;
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
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);

  useEffect(() => {
    fetchAssignments();
  }, []);

  const fetchAssignments = async () => {
    const { data: assignmentRows, error: aErr } = await supabase
      .from("assignments")
      .select("*")
      .in("status", ["pending", "rejected"])
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

    const profileMap = new Map(profileRows.map((p: any) => [p.id, p]));
    const enriched = (assignmentRows as any[]).map((a) => ({
      ...a,
      profiles: profileMap.get(a.student_id) || null,
    }));

    setAssignments(enriched as any);
  };

  const openPdf = async (path: string) => {
    const { data, error } = await supabase.storage
      .from('assignments')
      .createSignedUrl(path, 600);
    if (error || !data?.signedUrl) {
      toast.error(error?.message || 'Unable to open file');
      return;
    }
    setPdfUrl(data.signedUrl);
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
                    <span>{assignment.profiles?.full_name || "Unknown"} ({assignment.profiles?.email || "N/A"})</span>
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
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => openPdf(assignment.file_path)}
                  >
                    View PDF
                  </Button>
                  <Button onClick={() => setSelectedAssignment(assignment)}>Review</Button>
                </div>
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
      <Dialog open={!!pdfUrl} onOpenChange={() => setPdfUrl(null)}>
        <DialogContent className="max-w-5xl">
          <DialogHeader>
            <DialogTitle>View PDF</DialogTitle>
          </DialogHeader>
          <div className="h-[80vh]">
            {pdfUrl ? (
              <iframe
                src={pdfUrl}
                className="h-full w-full rounded-md border border-border"
                title="Assignment PDF"
              />
            ) : null}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
