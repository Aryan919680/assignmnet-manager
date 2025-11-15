import { useState, useEffect } from "react";
import { User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/Badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { FileText, User as UserIcon, FileUp, Menu, Users } from "lucide-react";
import CreateAssignment from "@/components/mentor/CreateAssignment";
import MentorRubricAssessment from "@/components/MentorRubricAssessment";

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
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("Assignment Manager");
  const [activeTab, setActiveTab] = useState<"create" | "submissions">("create");

  useEffect(() => {
    if (activeSection === "Assignment Manager" && activeTab === "submissions") {
      fetchAssignments();
    }
  }, [activeSection, activeTab]);

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

    if (!assignmentRows?.length) {
      setAssignments([]);
      return;
    }

    const studentIds = Array.from(new Set(assignmentRows.map((a) => a.student_id)));
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
    const { data, error } = await supabase.storage.from("assignments").download(path);
    if (error || !data) {
      toast.error("Unable to fetch PDF file");
      return null;
    }
    return URL.createObjectURL(data);
  };

  const handleReviewClick = async (assignment: Assignment) => {
    const url = await openPdf(assignment.file_path);
    setPdfUrl(url);
    setSelectedAssignment(assignment);
  };

  const handleRubricSubmit = async (rubricData: any) => {
    if (!selectedAssignment) return;

    try {
      const { error: reviewError } = await supabase.from("reviews").insert({
        assignment_id: selectedAssignment.id,
        reviewer_id: user.id,
        reviewer_role: "mentor",
        rubric: rubricData,
        action: "reviewed",
      });

      if (reviewError) throw reviewError;

      const { error: updateError } = await supabase
        .from("assignments")
        .update({ status: "mentor_review" })
        .eq("id", selectedAssignment.id);

      if (updateError) throw updateError;

      toast.success("Assessment submitted successfully!");
      setSelectedAssignment(null);
      setPdfUrl(null);
      fetchAssignments();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const sidebarItems = [
    { name: "Assignment Manager", icon: FileUp },
    { name: "Manage Students", icon: Users },
  ];

  return (
    <div className="flex min-h-screen bg-muted/10">
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-40 w-64 transform border-r border-border transition-transform duration-200 ease-in-out lg:static lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-16 items-center justify-center border-b border-border font-bold text-xl text-primary">
          Mentor Portal
        </div>
        <nav className="p-4 space-y-2">
          {sidebarItems.map(({ name, icon: Icon }) => (
            <button
              key={name}
              onClick={() => {
                setActiveSection(name);
                setSidebarOpen(false);
              }}
              className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                activeSection === name
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <Icon className="h-4 w-4" />
              {name}
            </button>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 lg:ml-0">
        {/* Mobile Header */}
        <div className="sticky top-0 z-30 flex items-center justify-between border-b bg-white px-4 py-3 shadow-sm lg:hidden">
          <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(!sidebarOpen)}>
            <Menu className="h-5 w-5" />
          </Button>
          <h1 className="text-lg font-semibold">{activeSection}</h1>
        </div>

        <div className="p-6">
          {/* Assignment Manager Section */}
          {activeSection === "Assignment Manager" && (
            <>
              {/* Top Bar Tabs */}
              <div className="flex items-center gap-4 mb-6 border-b border-border pb-2">
                <button
                  onClick={() => setActiveTab("create")}
                  className={`px-3 py-1.5 text-sm font-medium rounded-md ${
                    activeTab === "create"
                      ? "bg-primary text-white"
                      : "text-muted-foreground hover:bg-muted"
                  }`}
                >
                  Create Assignment
                </button>
                <button
                  onClick={() => setActiveTab("submissions")}
                  className={`px-3 py-1.5 text-sm font-medium rounded-md ${
                    activeTab === "submissions"
                      ? "bg-primary text-white"
                      : "text-muted-foreground hover:bg-muted"
                  }`}
                >
                  Manage Submissions
                </button>
              </div>

              {/* Content based on tab */}
              {activeTab === "create" && <CreateAssignment />}

              {activeTab === "submissions" && (
                <div className="grid gap-4">
                  {assignments.length === 0 ? (
                    <div className="text-muted-foreground py-12 text-center">
                      No pending submissions.
                    </div>
                  ) : (
                    assignments.map((assignment) => (
                      <Card
                        key={assignment.id}
                        className="border-border/50 transition-colors hover:border-primary/30"
                      >
                        <CardHeader>
                          <div className="flex items-start justify-between">
                            <div>
                              <CardTitle className="text-lg">{assignment.title}</CardTitle>
                              <CardDescription className="mt-1">
                                {assignment.description}
                              </CardDescription>
                              <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                                <UserIcon className="h-4 w-4" />
                                <span>
                                  {assignment.profiles?.full_name || "Unknown"} (
                                  {assignment.profiles?.email || "N/A"})
                                </span>
                              </div>
                            </div>
                            <Badge variant="warning">Needs Review</Badge>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <FileText className="h-4 w-4" />
                              <span>
                                Submitted on{" "}
                                {new Date(assignment.created_at).toLocaleDateString()}
                              </span>
                            </div>
                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                onClick={() => handleReviewClick(assignment)}
                              >
                                Review
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              )}
            </>
          )}

          {/* Manage Students Section */}
          {activeSection === "Manage Students" && (
            <div className="text-muted-foreground py-12 text-center">
              Coming soon: Manage Students
            </div>
          )}
        </div>
      </div>

      {/* Combined Review Dialog (PDF + Rubric) */}
      <Dialog open={!!selectedAssignment} onOpenChange={() => setSelectedAssignment(null)}>
        <DialogContent className="max-w-[95vw] w-[95vw] h-[90vh] p-0">
          <div className="flex h-[650px]">
            {/* PDF Viewer */}
            <div className="w-1/2 border-r p-2">
              {pdfUrl ? (
                <iframe src={pdfUrl} className="w-full h-full rounded" style={{ border: "none" }} />
              ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                  Loading PDF...
                </div>
              )}
            </div>

            {/* Rubric Form */}
            <div className="w-1/2 overflow-y-auto p-4">
              <DialogHeader>
                <DialogTitle>Review Assignment — {selectedAssignment?.title}</DialogTitle>
                <DialogDescription>
                  View PDF on the left and complete the rubric here.
                </DialogDescription>
              </DialogHeader>

              <MentorRubricAssessment onSubmit={handleRubricSubmit} />
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
