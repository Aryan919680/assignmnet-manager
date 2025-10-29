import React, { useState } from "react";

const criteriaList = [
  "Paper Topic",
  "Academic Research Articles",
  "Annotations",
  "Working Outline",
];

interface MentorRubricAssessmentProps {
  onSubmit?: (data: any) => void;
}

const MentorRubricAssessment: React.FC<MentorRubricAssessmentProps> = ({
  onSubmit,
}) => {
  const [formData, setFormData] = useState(
    criteriaList.map(() => ({ score: "", comment: "" }))
  );
  const [overallComment, setOverallComment] = useState("");

  const handleChange = (index: number, field: string, value: string) => {
    const updated = [...formData];
    updated[index] = { ...updated[index], [field]: value };
    setFormData(updated);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    for (let criterion of formData) {
      if (!criterion.score) {
        alert("Please fill all rubric scores before submitting.");
        return;
      }
    }

    const data = { criteria: formData, overallComment };
    if (onSubmit) onSubmit(data);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="border border-gray-300 rounded-lg p-6"
    >
      {criteriaList.map((criterion, index) => (
        <div key={index} className="mb-6 pb-4 border-b border-gray-200">
          <label className="block font-semibold mb-2">{criterion}</label>
          <select
            className="w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-2 focus:ring-blue-500 text-black"
            required
            value={formData[index].score}
            onChange={(e) => handleChange(index, "score", e.target.value)}
          >
            <option value="">Select score</option>
            <option value="0">0 - Not Completed</option>
            <option value="1">1 - Beginning</option>
            <option value="2">2 - Developing</option>
            <option value="3">3 - Accomplished</option>
            <option value="4">4 - Exemplary</option>
          </select>
          <textarea
            className="w-full border border-gray-300 rounded-md p-2 mt-3 text-sm resize-y focus:ring-2 focus:ring-blue-500 text-black"
            placeholder={`Enter comments for ${criterion}`}
            value={formData[index].comment}
            onChange={(e) => handleChange(index, "comment", e.target.value)}
          ></textarea>
        </div>
      ))}

      <div className="mt-6">
        <label className="block font-semibold mb-2">Overall Feedback</label>
        <textarea
          className="w-full border border-gray-300 rounded-md p-2 text-sm resize-y focus:ring-2 focus:ring-blue-500 text-black"
          placeholder="General remarks about the submission"
          value={overallComment}
          onChange={(e) => setOverallComment(e.target.value)}
        ></textarea>
      </div>

      <div className="flex justify-end gap-4 mt-8">
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-md"
        >
          Submit Assessment
        </button>
      </div>
    </form>
  );
};

export default MentorRubricAssessment;
