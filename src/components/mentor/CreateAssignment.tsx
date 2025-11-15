import React, { useState } from "react";
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

const CreateAssignment: React.FC = () => {
  const [title, setTitle] = useState("");
  const [classSection, setClassSection] = useState("");
  const [subject, setSubject] = useState("");
  const [instructions, setInstructions] = useState("");
  const [deadline, setDeadline] = useState("");
  const [allowLate, setAllowLate] = useState(false);
  const [rubric, setRubric] = useState("default");

  const handlePublish = () => {
    if (!title || !classSection || !subject || !instructions || !deadline) {
      toast.error("Please fill all required fields.");
      return;
    }
    toast.success("Assignment published successfully!");
  };

  const handleClear = () => {
    setTitle("");
    setClassSection("");
    setSubject("");
    setInstructions("");
    setDeadline("");
    setAllowLate(false);
    setRubric("default");
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">
          Create Assignment
        </h1>
        <p className="text-sm text-muted-foreground">
          Set deadlines, instructions, and control late submissions.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left - Form */}
        <Card className="border-border shadow-sm">
          <CardHeader>
            <CardTitle>New Assignment</CardTitle>
            <CardDescription>
              Fields marked <span className="text-destructive">*</span> are
              required.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Title */}
            <div className="space-y-1.5">
              <Label>
                Title <span className="text-destructive">*</span>
              </Label>
              <Input
                placeholder="e.g., Research Paper on Sustainability"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            {/* Class & Subject */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>
                  Class / Section <span className="text-destructive">*</span>
                </Label>
                <select
                  value={classSection}
                  onChange={(e) => setClassSection(e.target.value)}
                  className="w-full rounded-md border border-input bg-background p-2 text-sm"
                >
                  <option value="">Select...</option>
                  <option value="10A">10A</option>
                  <option value="10B">10B</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <Label>
                  Subject <span className="text-destructive">*</span>
                </Label>
                <select
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full rounded-md border border-input bg-background p-2 text-sm"
                >
                  <option value="">Select...</option>
                  <option value="Science">Science</option>
                  <option value="Math">Math</option>
                </select>
              </div>
            </div>

            {/* Instructions */}
            <div className="space-y-1.5">
              <Label>
                Instructions / Brief <span className="text-destructive">*</span>
              </Label>
              <Textarea
                rows={4}
                placeholder="Describe what students should deliver..."
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
              />
            </div>

            {/* Deadline & Rubric */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>
                  Deadline (date & time)
                  <span className="text-destructive">*</span>
                </Label>
                <Input
                  type="datetime-local"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                />
              </div>

              <div className="space-y-1.5">
                <Label>Rubric Template</Label>
                <select
                  value={rubric}
                  onChange={(e) => setRubric(e.target.value)}
                  className="w-full rounded-md border border-input bg-background p-2 text-sm"
                >
                  <option value="default">
                    Default (Originality / Rigor / Format)
                  </option>
                  <option value="simple">Simple Rubric</option>
                </select>
              </div>
            </div>

            {/* Allow Late Submissions */}
            <div className="flex items-center justify-between border-t pt-3">
              <Label htmlFor="allowLate">Allow Late Submissions</Label>
              <Switch
                id="allowLate"
                checked={allowLate}
                onCheckedChange={setAllowLate}
              />
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-3 pt-2">
              <Button variant="outline" onClick={handleClear}>
                Clear
              </Button>
              <Button variant="secondary">Preview</Button>
              <Button onClick={handlePublish}>Publish</Button>
            </div>
          </CardContent>
        </Card>

        {/* Right - Live Preview */}
        <Card className="border-border shadow-sm">
          <CardHeader>
            <CardTitle>Live Preview</CardTitle>
            <CardDescription>
              Review the assignment details before publishing.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <div className="border rounded-md p-3">
              <p>
                <b>Title:</b> {title || "—"}
              </p>
              <p>
                <b>Class:</b> {classSection || "—"} •{" "}
                <b>Subject:</b> {subject || "—"}
              </p>
            </div>

            <div className="border rounded-md p-3">
              <p>
                <b>Deadline:</b>{" "}
                {deadline
                  ? new Date(deadline).toLocaleString()
                  : "—"}
              </p>
              <p>
                <b>Late Submissions:</b> {allowLate ? "Allowed" : "Not allowed"}
              </p>
            </div>

            <div className="border rounded-md p-3">
              <b>Instructions:</b>
              <p className="text-muted-foreground">
                {instructions || "—"}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CreateAssignment;
