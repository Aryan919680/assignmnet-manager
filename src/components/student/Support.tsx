import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/Badge";
import { toast } from "sonner";
import { LifeBuoy, Send, Ticket } from "lucide-react";

interface SupportTicket {
  id: string;
  subject: string;
  description: string;
  status: string;
  created_at: string;
}

export default function Support() {
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) return;

      const { data, error } = await supabase
        .from("support_tickets")
        .select("*")
        .eq("student_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setTickets(data || []);
    } catch (error) {
      console.error("Error fetching tickets:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!subject.trim() || !description.trim()) {
      toast.error("Please fill in all fields");
      return;
    }

    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) throw new Error("Not authenticated");

      const { error } = await supabase.from("support_tickets").insert({
        student_id: user.id,
        subject,
        description,
        status: "open",
      });

      if (error) throw error;

      toast.success("Ticket submitted successfully!");
      setSubject("");
      setDescription("");
      setShowForm(false);
      fetchTickets();
    } catch (error: any) {
      toast.error(error.message || "Failed to submit ticket");
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "open":
        return <Badge variant="warning">Open</Badge>;
      case "closed":
        return <Badge variant="secondary">Closed</Badge>;
      case "resolved":
        return <Badge variant="success">Resolved</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-primary/10 rounded-full">
            <LifeBuoy className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h2 className="text-3xl font-bold">Support Center</h2>
            <p className="text-muted-foreground">
              Need help? Submit a support ticket
            </p>
          </div>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          <Send className="mr-2 h-4 w-4" />
          {showForm ? "Cancel" : "New Ticket"}
        </Button>
      </div>

      {showForm && (
        <Card className="border-primary/20">
          <CardHeader>
            <CardTitle>Submit a Support Ticket</CardTitle>
            <CardDescription>
              Describe your issue and we'll get back to you soon
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Input
                  id="subject"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Brief description of the issue"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Provide detailed information about your problem"
                  rows={5}
                  required
                />
              </div>
              <Button type="submit" disabled={loading} className="w-full">
                {loading ? "Submitting..." : "Submit Ticket"}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="space-y-4">
        <h3 className="text-xl font-semibold flex items-center gap-2">
          <Ticket className="h-5 w-5" />
          Your Tickets
        </h3>

        {tickets.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <LifeBuoy className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground text-center">
                No support tickets yet. If you need help, create a new ticket.
              </p>
            </CardContent>
          </Card>
        ) : (
          tickets.map((ticket) => (
            <Card key={ticket.id} className="border-border/50">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{ticket.subject}</CardTitle>
                    <CardDescription className="mt-2">
                      {ticket.description}
                    </CardDescription>
                  </div>
                  {getStatusBadge(ticket.status)}
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Submitted on {new Date(ticket.created_at).toLocaleDateString()} at{" "}
                  {new Date(ticket.created_at).toLocaleTimeString()}
                </p>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
