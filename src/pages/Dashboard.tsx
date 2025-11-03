import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import { AuthGuard } from "@/components/AuthGuard";
import StudentDashboard from "@/components/dashboards/StudentDashboard";
import MentorDashboard from "@/components/dashboards/MentorDashboard";
import HODDashboard from "@/components/dashboards/HODDashboard";
import PrincipalDashboard from "@/components/dashboards/PrincipalDashboard";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
      if (user) {
        supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", user.id)
          .single()
          .then(({ data }) => {
            setRole(data?.role || null);
            setLoading(false);
          });
      }
    });
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success("Logged out successfully");
    navigate("/auth");
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  const renderDashboard = () => {
    if (!user) return null;
    
    switch (role) {
      case "student":
        return <StudentDashboard user={user} />;
      case "mentor":
        return <MentorDashboard user={user} />;
      case "hod":
        return <HODDashboard user={user} />;
      case "principal":
        return <PrincipalDashboard />;
      default:
        return <div>No role assigned</div>;
    }
  };

  return (
    <AuthGuard>
      <div className="min-h-screen bg-background">
        <header className="border-b border-border/50 bg-card/30 backdrop-blur">
          <div className="container mx-auto flex h-16 items-center justify-between px-4">
            <h1 className="text-xl font-semibold">Assignment Manager</h1>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        </header>
        {renderDashboard()}
      </div>
    </AuthGuard>
  );
}
