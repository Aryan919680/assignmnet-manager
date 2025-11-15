import React, { useState } from "react";
import { Button } from "@/components/ui/button";

const criteriaList = [
  "Paper Topic",
  "Academic Research Articles",
  "Annotations",
  "Working Outline",
];

interface MentorRubricAssessmentProps {
  onSubmit?: (data: any) => void;
}

const MentorRubricAssessment: React.FC<MentorRubricAssessmentProps> = ({ onSubmit }) => {
  const [formData, setFormData] = useState(
    criteriaList.map((name) => ({ name, score: "", comment: "" }))
  );

  const [overallComment, setOverallComment] = useState("");

  const handleChange = (index: number, field: string, value: string) => {
    const updated = [...formData];
    updated[index] = { ...updated[index], [field]: value };
    setFormData(updated);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    for (let c of formData) {
      if (!c.score) {
        alert("Please fill all rubric scores before submitting.");
        return;
      }
    }

    if (onSubmit) onSubmit({ criteria: formData, overallComment });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col h-[650px] overflow-hidden">

      {/* Scroll area */}
      <div className="flex-1 overflow-y-auto space-y-6 pr-2 pb-20">

        {formData.map((item, index) => (
          <div key={index} className="border-b pb-6">
            <label className="block font-medium text-sm mb-2">{item.name}</label>

            {/* Score */}
            <select
              className="w-full border bg-background border-border rounded-md p-2 text-sm focus:ring-2 focus:ring-primary"
              required
              value={item.score}
              onChange={(e) => handleChange(index, "score", e.target.value)}
            >
              <option value="">Select score</option>
              <option value="0">0 - Not Completed</option>
              <option value="1">1 - Beginning</option>
              <option value="2">2 - Developing</option>
              <option value="3">3 - Accomplished</option>
              <option value="4">4 - Exemplary</option>
            </select>

            {/* Comments */}
            <textarea
              className="w-full mt-3 border bg-background border-border rounded-md p-2 text-sm resize-y focus:ring-2 focus:ring-primary"
              placeholder={`Enter comments for ${item.name}`}
              value={item.comment}
              onChange={(e) => handleChange(index, "comment", e.target.value)}
            />
          </div>
        ))}

        {/* Overall feedback */}
        <div>
          <label className="block font-medium text-sm mb-2">Overall Feedback</label>
          <textarea
            className="w-full border bg-background border-border rounded-md p-2 text-sm resize-y focus:ring-2 focus:ring-primary"
            placeholder="General remarks about the submission"
            value={overallComment}
            onChange={(e) => setOverallComment(e.target.value)}
          />
        </div>
<div className="bg-background border-t border-border p-4 flex justify-end items-center">
  <Button type="submit" className="px-6 font-medium rounded-lg">
    Submit Assessment
  </Button>
</div>
      </div>

      {/* Sticky footer */}
  

    </form>
  );
};

export default MentorRubricAssessment;
