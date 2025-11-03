import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/Badge";
import { CheckCircle, Award } from "lucide-react";

interface Assignment {
  id: string;
  title: string;
  description: string;
  created_at: string;
}

export default function Portfolio() {
  const [approvedAssignments, setApprovedAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApprovedAssignments();
  }, []);

  const fetchApprovedAssignments = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) return;

      const { data, error } = await supabase
        .from("assignments")
        .select("id, title, description, created_at")
        .eq("student_id", user.id)
        .eq("status", "approved")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setApprovedAssignments(data || []);
    } catch (error) {
      console.error("Error fetching approved assignments:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Award className="h-8 w-8 text-primary" />
        <div>
          <h2 className="text-3xl font-bold">My Portfolio</h2>
          <p className="text-muted-foreground">
            All your approved assignments in one place
          </p>
        </div>
      </div>

      {approvedAssignments.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Award className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground text-center">
              No approved assignments yet. Keep working hard!
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {approvedAssignments.map((assignment) => (
            <Card
              key={assignment.id}
              className="border-border/50 transition-all hover:border-primary/30 hover:shadow-lg"
            >
              <CardHeader>
                <div className="flex items-start justify-between gap-2">
                  <CardTitle className="text-lg line-clamp-2">
                    {assignment.title}
                  </CardTitle>
                  <CheckCircle className="h-5 w-5 text-success flex-shrink-0" />
                </div>
                <CardDescription className="line-clamp-3">
                  {assignment.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <Badge variant="success">Approved</Badge>
                  <span className="text-sm text-muted-foreground">
                    {new Date(assignment.created_at).toLocaleDateString()}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {approvedAssignments.length > 0 && (
        <div className="text-center pt-4">
          <p className="text-lg font-semibold text-primary">
            🎉 {approvedAssignments.length} Assignment{approvedAssignments.length !== 1 ? 's' : ''} Completed!
          </p>
        </div>
      )}
    </div>
  );
}
