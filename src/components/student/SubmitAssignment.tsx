// "use client";

// import { useState } from "react";
// import { supabase } from "@/integrations/supabase/client"; // adjust path if needed
// import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
// import { Label } from "@/components/ui/label";
// import { Input } from "@/components/ui/input";
// import { Textarea } from "@/components/ui/textarea";
// import { Button } from "@/components/ui/button";
// import { toast } from "sonner";

// export default function SubmitAssignment({ user, fetchAssignments }: any) {
//   const [showForm, setShowForm] = useState(true);
//   const [title, setTitle] = useState("");
//   const [description, setDescription] = useState("");
//   const [file, setFile] = useState<File | null>(null);
//   const [loading, setLoading] = useState(false);

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     if (!file) {
//       toast.error("Please select a file");
//       return;
//     }

//     setLoading(true);

//     try {
//       const fileExt = file.name.split(".").pop();
//       const fileName = `${user.id}/${Date.now()}.${fileExt}`;

//       // Upload PDF to Supabase Storage
//       const { error: uploadError } = await supabase.storage
//         .from("assignments")
//         .upload(fileName, file);

//       if (uploadError) throw uploadError;

//       // Save metadata to DB
//       const { error: insertError } = await supabase.from("assignments").insert({
//         student_id: user.id,
//         title,
//         description,
//         file_path: fileName,
//         status: "pending",
//       });

//       if (insertError) throw insertError;

//       toast.success("Assignment submitted successfully!");

//       // Reset form + refresh list
//       setTitle("");
//       setDescription("");
//       setFile(null);
//       setShowForm(false);
//       fetchAssignments?.();
//     } catch (error: any) {
//       toast.error(error.message || "Error submitting assignment");
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (!showForm) {
//     return (
//       <Card className="p-6 text-center border-green-500/30">
//         <h2 className="text-lg font-semibold">✅ Assignment Submitted</h2>
//         <p className="text-sm text-muted-foreground mt-1">
//           You can view your submission in My Assignments
//         </p>
//       </Card>
//     );
//   }

//   return (
//     <Card className="mb-8 border-primary/30 shadow-sm">
//       <CardHeader>
//         <CardTitle>Submit / Resubmit Assignment</CardTitle>
//         <CardDescription>Upload your assignment PDF</CardDescription>
//       </CardHeader>
//       <CardContent>
//         <form onSubmit={handleSubmit} className="space-y-4">
          
//           {/* Title */}
//           <div className="space-y-2">
//             <Label htmlFor="title">Title</Label>
//             <Input
//               id="title"
//               value={title}
//               onChange={(e) => setTitle(e.target.value)}
//               placeholder="Assignment title"
//               required
//             />
//           </div>

//           {/* Description */}
//           <div className="space-y-2">
//             <Label htmlFor="description">Description</Label>
//             <Textarea
//               id="description"
//               value={description}
//               onChange={(e) => setDescription(e.target.value)}
//               placeholder="Brief description"
//               rows={3}
//             />
//           </div>

//           {/* File */}
//           <div className="space-y-2">
//             <Label htmlFor="file">PDF File</Label>
//             <Input
//               id="file"
//               type="file"
//               accept="application/pdf"
//               onChange={(e) => setFile(e.target.files?.[0] || null)}
//               required
//             />

//             {file && (
//               <p className="text-xs text-muted-foreground">
//                 📄 {file.name}
//               </p>
//             )}
//           </div>

//           {/* Submit */}
//           <Button type="submit" className="w-full" disabled={loading}>
//             {loading ? "Uploading..." : "Submit Assignment"}
//           </Button>
//         </form>
//       </CardContent>
//     </Card>
//   );
// }

"use client";

import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function SubmitAssignment({ user, assignment, fetchAssignments }: any) {
  console.log("SubmitAssignment received assignment:", assignment);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

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

      // Upload PDF to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from("assignments")
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      // Save metadata to DB
      const { error: insertError } = await supabase.from("assignments").insert({
        student_id: user.id,
        title : assignment[0].title,
        description : assignment[0].description,
        file_path: fileName,
        status: "pending",
      });

      if (insertError) throw insertError;

      toast.success("Assignment submitted successfully!");


      setFile(null);
      fetchAssignments?.();
    } catch (error: any) {
      toast.error(error.message || "Error submitting assignment");
    } finally {
      setLoading(false);
    }
  };
  return (
    <Card className="mb-8 border-primary/30 shadow-sm">
      <CardHeader>
        <CardTitle>Submit Assignment</CardTitle>
        <CardDescription>Upload your PDF file</CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Title (Read Only) */}
          <div className="space-y-2">
            <Label>Title</Label>
            <Input value={assignment[0].title} readOnly />
          </div>

          {/* Description (Read Only) */}
          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea value={assignment[0].description} readOnly rows={3} />
          </div>

          {/* Deadline Info */}
          <p className="text-sm text-red-500">
            Deadline: {new Date(assignment[0].deadline).toLocaleString()}
          </p>

          {/* File Upload */}
          <div className="space-y-2">
            <Label>Upload PDF</Label>
            <Input
              type="file"
              accept="application/pdf"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              required
            />
          </div>

          {/* Submit */}
          <Button disabled={loading} className="w-full">
            {loading ? "Submitting..." : "Submit Assignment"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
