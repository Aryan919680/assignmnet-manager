import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { GraduationCap, Upload, CheckCircle, Users } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b border-border/50 bg-card/30 backdrop-blur">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <GraduationCap className="h-6 w-6 text-primary" />
            </div>
            <span className="text-xl font-semibold">Assignment Manager</span>
          </div>
          <Button onClick={() => navigate("/auth")}>Get Started</Button>
        </div>
      </header>

      <main className="flex-1">
        <section className="container mx-auto px-4 py-20 text-center">
          <div className="mx-auto max-w-3xl">
            <h1 className="mb-6 text-5xl font-bold tracking-tight">
              Streamline Your Assignment Workflow
            </h1>
            <p className="mb-8 text-xl text-muted-foreground">
              A comprehensive platform for students, mentors, and administrators to manage 
              assignment submissions, reviews, and approvals efficiently.
            </p>
            <Button size="lg" onClick={() => navigate("/auth")} className="px-8">
              Start Managing Assignments
            </Button>
          </div>
        </section>

        <section className="container mx-auto px-4 py-20">
          <div className="grid gap-8 md:grid-cols-3">
            <div className="rounded-lg border border-border/50 bg-card/50 p-6 text-center backdrop-blur transition-colors hover:border-primary/30">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <Upload className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mb-2 text-xl font-semibold">Easy Submission</h3>
              <p className="text-muted-foreground">
                Students can quickly upload their assignments in PDF format with descriptions
              </p>
            </div>

            <div className="rounded-lg border border-border/50 bg-card/50 p-6 text-center backdrop-blur transition-colors hover:border-primary/30">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mb-2 text-xl font-semibold">Multi-Level Review</h3>
              <p className="text-muted-foreground">
                Structured workflow from mentor review to HOD approval
              </p>
            </div>

            <div className="rounded-lg border border-border/50 bg-card/50 p-6 text-center backdrop-blur transition-colors hover:border-primary/30">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <CheckCircle className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mb-2 text-xl font-semibold">Track Progress</h3>
              <p className="text-muted-foreground">
                Real-time status updates and feedback throughout the review process
              </p>
            </div>
          </div>
        </section>

        <section className="container mx-auto px-4 py-20">
          <div className="rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/5 to-accent/5 p-12 text-center backdrop-blur">
            <h2 className="mb-4 text-3xl font-bold">Ready to Get Started?</h2>
            <p className="mb-6 text-lg text-muted-foreground">
              Join as a student, mentor, HOD, or principal and experience seamless assignment management
            </p>
            <Button size="lg" onClick={() => navigate("/auth")} className="px-8">
              Sign Up Now
            </Button>
          </div>
        </section>
      </main>

      <footer className="border-t border-border/50 py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>© 2025 Assignment Manager. Built for academic excellence.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
