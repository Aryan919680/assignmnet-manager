import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";

const CreateAssignment: React.FC = () => {
  const [title, setTitle] = useState("");
  const [classId, setClassId] = useState<string>("");
  const [classes, setClasses] = useState<any[]>([]);
  const [subject, setSubject] = useState("");
  const [instructions, setInstructions] = useState("");
  const [deadline, setDeadline] = useState("");
  const [allowLate, setAllowLate] = useState(false);

  // Load classes from DB
  useEffect(() => {
    const loadClasses = async () => {
      const { data, error } = await supabase.from("classes").select("*");

      if (error) {
        toast.error("Error loading classes");
        return;
      }

      setClasses(data);
    };

    loadClasses();
  }, []);

  const handlePublish = async () => {
    if (!title || !classId || !subject || !instructions || !deadline) {
      toast.error("Please fill all required fields.");
      return;
    }

    try {
      const { error } = await supabase.from("assignments").insert([
        {
          title,
          description: instructions,
          class_id: classId, // ⭐ IMPORTANT
          subject,
          file_path: null,
          student_id: null,
          status: "pending",
          deadline,
          allow_late: allowLate,
        },
      ]);

      if (error) throw error;

      toast.success("Assignment created successfully!");
      handleClear();
    } catch (err: any) {
      toast.error("Error creating assignment: " + err.message);
    }
  };

  const handleClear = () => {
    setTitle("");
    setClassId("");
    setSubject("");
    setInstructions("");
    setDeadline("");
    setAllowLate(false);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">
          Create Assignment
        </h1>
        <p className="text-sm text-muted-foreground">
          Assign work to a specific class and set deadlines.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* LEFT SIDE FORM */}
        <Card>
          <CardHeader>
            <CardTitle>Assignment Details</CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">

            {/* Title */}
            <div className="space-y-1.5">
              <Label>Title *</Label>
              <Input
                placeholder="e.g., Science Project Report"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            {/* Class Dropdown */}
            <div className="space-y-1.5">
              <Label>Class *</Label>
              <Select value={classId} onValueChange={setClassId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a class" />
                </SelectTrigger>
                <SelectContent>
                  {classes.map((cls) => (
                    <SelectItem key={cls.id} value={cls.id}>
                      {cls.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Subject */}
            <div className="space-y-1.5">
              <Label>Subject *</Label>
              <Input
                placeholder="e.g., Mathematics"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
              />
            </div>

            {/* Instructions */}
            <div className="space-y-1.5">
              <Label>Instructions *</Label>
              <Textarea
                rows={4}
                placeholder="Describe what students need to submit..."
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
              />
            </div>

            {/* Deadline */}
            <div className="space-y-1.5">
              <Label>Deadline *</Label>
              <Input
                type="datetime-local"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
              />
            </div>

            {/* Allow Late */}
            <div className="flex items-center justify-between border-t pt-3">
              <Label>Allow Late Submissions</Label>
              <Switch
                checked={allowLate}
                onCheckedChange={setAllowLate}
              />
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-3 pt-2">
              <Button variant="outline" onClick={handleClear}>
                Clear
              </Button>
              <Button onClick={handlePublish}>Publish</Button>
            </div>
          </CardContent>
        </Card>

        {/* RIGHT SIDE PREVIEW */}
        <Card>
          <CardHeader>
            <CardTitle>Live Preview</CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">

            <div className="border rounded-md p-3">
              <p><b>Title:</b> {title || "—"}</p>
              <p>
                <b>Class:</b>{" "}
                {classes.find((c) => c.id === classId)?.name || "—"}  
                &nbsp;•&nbsp;
                <b>Subject:</b> {subject || "—"}
              </p>
            </div>

            <div className="border rounded-md p-3">
              <p>
                <b>Deadline:</b>{" "}
                {deadline ? new Date(deadline).toLocaleString() : "—"}
              </p>
              <p>
                <b>Late Submissions:</b>{" "}
                {allowLate ? "Allowed" : "Not allowed"}
              </p>
            </div>

            <div className="border rounded-md p-3">
              <b>Instructions:</b>
              <p className="text-muted-foreground">{instructions || "—"}</p>
            </div>

          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CreateAssignment;
