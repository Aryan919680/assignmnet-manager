import { useState, useEffect } from "react";
import { User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/Badge";
import { toast } from "sonner";
import {
  Upload,
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Menu,
  LayoutDashboard,
  FolderOpen,
  FileUp,
  MessageSquare,
  Briefcase,
  Bot,
  LifeBuoy,
} from "lucide-react";
import Dashboard from "../student/Dashboard";
import SubmitAssignment from "../student/SubmitAssignment";
import Feedback from "../student/Feedback";
import Portfolio from "../student/Portfolio";
import AICompanion from "../student/AICompanion";
import Support from "../student/Support";

interface Review {
  comments: string;
  action: string;
  reviewer_role: string;
}

interface Assignment {
  id: string;
  title: string;
  description: string;
  status: string;
  created_at: string;
  file_path: string;
  reviews?: Review[];
}

interface StudentDashboardProps {
  user: User;
}

export default function StudentDashboard({ user }: StudentDashboardProps) {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("Dashboard");

useEffect(() => {
  if (user?.id) {
    fetchAssignments();
  }
}, [user]);


const fetchAssignments = async () => {
  const { data, error } = await supabase
    .from("assignments")
    .select(`
      *,
      reviews (comments, action, reviewer_role)
    `)
    .eq("student_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching assignments:", error);
    return;
  }

  setAssignments(data || []);
};


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      toast.error("Please select a file");
      return;
    }

    setLoading(true);

    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("assignments")
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { error: insertError } = await supabase.from("assignments").insert({
        student_id: user.id,
        title,
        description,
        file_path: fileName,
        status: "pending",
      });

      if (insertError) throw insertError;

      toast.success("Assignment submitted successfully!");
      setTitle("");
      setDescription("");
      setFile(null);
      setShowForm(false);
      fetchAssignments();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return <Badge variant="success">Approved</Badge>;
      case "rejected":
        return <Badge variant="destructive">Rejected</Badge>;
      case "pending":
        return <Badge variant="warning">Pending Review</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return <CheckCircle className="h-5 w-5 text-success" />;
      case "rejected":
        return <XCircle className="h-5 w-5 text-destructive" />;
      default:
        return <Clock className="h-5 w-5 text-warning" />;
    }
  };

  const sidebarItems = [
    { name: "Dashboard", icon: LayoutDashboard },
    { name: "My Assignments", icon: FolderOpen },
    { name: "Submit / Resubmit", icon: FileUp },
    { name: "Feedback", icon: MessageSquare },
    { name: "Portfolio", icon: Briefcase },
    { name: "AI Companion", icon: Bot },
    { name: "Support", icon: LifeBuoy },
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
          Student Portal
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
        <div className="sticky top-0 z-30 flex items-center justify-between border-b bg-white px-4 py-3 shadow-sm lg:hidden">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <Menu className="h-5 w-5" />
          </Button>
          <h1 className="text-lg font-semibold">{activeSection}</h1>
        </div>

        <div className="p-6">
          {activeSection === "My Assignments" && (
            <>
              <div className="mb-8 flex items-center justify-between">
                <div>
                  <h2 className="text-3xl font-bold">Student Dashboard</h2>
                  <p className="text-muted-foreground">
                    Manage your assignments
                  </p>
                </div>
                <Button onClick={() => setShowForm(!showForm)}>
                  <Upload className="mr-2 h-4 w-4" />
                  {showForm ? "Cancel" : "Submit New Assignment"}
                </Button>
              </div>

              {showForm && (
                <Card className="mb-8 border-primary/20">
                  <CardHeader>
                    <CardTitle>Submit Assignment</CardTitle>
                    <CardDescription>Upload your assignment PDF</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="title">Title</Label>
                        <Input
                          id="title"
                          value={title}
                          onChange={(e) => setTitle(e.target.value)}
                          placeholder="Assignment title"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                          id="description"
                          value={description}
                          onChange={(e) =>
                            setDescription(e.target.value)
                          }
                          placeholder="Brief description"
                          rows={3}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="file">PDF File</Label>
                        <Input
                          id="file"
                          type="file"
                          accept=".pdf"
                          onChange={(e) =>
                            setFile(e.target.files?.[0] || null)
                          }
                          required
                        />
                      </div>
                      <Button type="submit" disabled={loading}>
                        {loading
                          ? "Submitting..."
                          : "Submit Assignment"}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              )}

              <div className="space-y-4">
                {assignments.map((assignment) => (
                  <Card
                    key={assignment.id}
                    className="border-border/50 transition-colors hover:border-primary/30"
                  >
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3">
                          {getStatusIcon(assignment.status)}
                          <div>
                            <CardTitle className="text-lg">
                              {assignment.title}
                            </CardTitle>
                            <CardDescription className="mt-1">
                              {assignment.description}
                            </CardDescription>
                            {assignment.status === "rejected" &&
                              assignment.reviews &&
                              assignment.reviews.length > 0 && (
                                <div className="mt-3 rounded-lg border border-destructive/50 bg-destructive/10 p-3">
                                  <div className="flex items-start gap-2">
                                    <AlertCircle className="h-4 w-4 text-destructive mt-0.5" />
                                    <div>
                                      <p className="text-sm font-semibold text-destructive">
                                        Rejection Feedback
                                      </p>
                                      {assignment.reviews
                                        .filter(
                                          (r) => r.action === "rejected"
                                        )
                                        .map((review, idx) => (
                                          <p
                                            key={idx}
                                            className="mt-1 text-sm text-muted-foreground"
                                          >
                                            {review.reviewer_role === "hod"
                                              ? "HOD"
                                              : "Mentor"}
                                            : {review.comments}
                                          </p>
                                        ))}
                                    </div>
                                  </div>
                                </div>
                              )}
                          </div>
                        </div>
                        {getStatusBadge(assignment.status)}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <FileText className="h-4 w-4" />
                        <span>
                          Submitted on{" "}
                          {new Date(
                            assignment.created_at
                          ).toLocaleDateString()}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </>
          )}

{
  activeSection === "Dashboard" && <Dashboard />
}
{
  activeSection === "Submit / Resubmit"  && <SubmitAssignment user={user} fetchAssignments={fetchAssignments}/>
}
{activeSection === "Feedback" && <Feedback user={user}/>}
          {activeSection === "Portfolio" && <Portfolio />}
          {activeSection === "AI Companion" && <AICompanion />}
          {activeSection === "Support" && <Support />}
        </div>
      </div>
    </div>
  );
}
