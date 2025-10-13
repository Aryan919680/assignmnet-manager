import { useState, useEffect } from "react";
import { User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/Badge";
import { FileText, User as UserIcon, TrendingUp, CheckCircle, Clock, XCircle } from "lucide-react";

interface Review {
  marks: number;
  comments: string;
  reviewer_role: string;
}

interface Assignment {
  id: string;
  title: string;
  description: string;
  status: string;
  created_at: string;
  profiles: { full_name: string; email: string };
  reviews: Review[];
}

interface PrincipalDashboardProps {
  user: User;
}

export default function PrincipalDashboard({ user }: PrincipalDashboardProps) {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [stats, setStats] = useState({ total: 0, approved: 0, pending: 0, rejected: 0 });

  useEffect(() => {
    fetchAssignments();
    fetchStats();
  }, []);

  const fetchAssignments = async () => {
    const { data } = await supabase
      .from("assignments")
      .select(`
        *,
        profiles:student_id (full_name, email),
        reviews (marks, comments, reviewer_role)
      `)
      .order("created_at", { ascending: false })
      .limit(20);

    if (data) setAssignments(data as any);
  };

  const fetchStats = async () => {
    const { count: total } = await supabase
      .from("assignments")
      .select("*", { count: "exact", head: true });

    const { count: approved } = await supabase
      .from("assignments")
      .select("*", { count: "exact", head: true })
      .eq("status", "approved");

    const { count: pending } = await supabase
      .from("assignments")
      .select("*", { count: "exact", head: true })
      .in("status", ["pending", "mentor_review", "hod_review"]);

    const { count: rejected } = await supabase
      .from("assignments")
      .select("*", { count: "exact", head: true })
      .eq("status", "rejected");

    setStats({
      total: total || 0,
      approved: approved || 0,
      pending: pending || 0,
      rejected: rejected || 0,
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return <Badge variant="success">Approved</Badge>;
      case "rejected":
        return <Badge variant="destructive">Rejected</Badge>;
      case "pending":
        return <Badge variant="warning">Pending Review</Badge>;
      case "mentor_review":
        return <Badge variant="secondary">With Mentor</Badge>;
      case "hod_review":
        return <Badge variant="secondary">With HOD</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold">Principal Dashboard</h2>
        <p className="text-muted-foreground">Overview of all assignments and progress</p>
      </div>

      <div className="mb-8 grid gap-4 md:grid-cols-4">
        <Card className="border-primary/20">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Assignments</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card className="border-success/20">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Approved</CardTitle>
            <CheckCircle className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">{stats.approved}</div>
          </CardContent>
        </Card>
        <Card className="border-warning/20">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning">{stats.pending}</div>
          </CardContent>
        </Card>
        <Card className="border-destructive/20">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Rejected</CardTitle>
            <XCircle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{stats.rejected}</div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        <h3 className="text-xl font-semibold">Recent Assignments</h3>
        {assignments.map((assignment) => (
          <Card key={assignment.id} className="border-border/50">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">{assignment.title}</CardTitle>
                  <CardDescription className="mt-1">{assignment.description}</CardDescription>
                  <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                    <UserIcon className="h-4 w-4" />
                    <span>{assignment.profiles.full_name}</span>
                  </div>
                  {assignment.reviews.length > 0 && (
                    <div className="mt-3 space-y-2">
                      {assignment.reviews.map((review, idx) => (
                        <div key={idx} className="rounded-lg bg-muted/50 p-2 text-sm">
                          <span className="font-semibold capitalize">{review.reviewer_role}:</span>
                          {review.marks && <span className="ml-2">Marks: {review.marks}/100</span>}
                          {review.comments && <p className="mt-1 text-muted-foreground">{review.comments}</p>}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                {getStatusBadge(assignment.status)}
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <FileText className="h-4 w-4" />
                <span>Submitted on {new Date(assignment.created_at).toLocaleDateString()}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
