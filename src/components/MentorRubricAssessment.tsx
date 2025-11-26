
// import React, { useState } from "react";
// import { Button } from "@/components/ui/button";

// const criteriaList = [
//   "Paper Topic",
//   "Academic Research Articles",
//   "Annotations",
//   "Working Outline",
// ];

// interface MentorRubricAssessmentProps {
//   onSubmit?: (data: any) => void;
// }

// const MentorRubricAssessment: React.FC<MentorRubricAssessmentProps> = ({ onSubmit }) => {
//   const [formData, setFormData] = useState(
//     criteriaList.map((name) => ({ name, score: "", comment: "" }))
//   );

//   const [overallComment, setOverallComment] = useState("");

//   const handleChange = (index: number, field: string, value: string) => {
//     const updated = [...formData];
//     updated[index] = { ...updated[index], [field]: value };
//     setFormData(updated);
//   };

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();

//     for (let c of formData) {
//       if (!c.score) {
//         alert("Please fill all rubric scores before submitting.");
//         return;
//       }
//     }

//     if (onSubmit) onSubmit({ criteria: formData, overallComment });
//   };

//   return (
//     <form onSubmit={handleSubmit} className="flex flex-col h-[650px] overflow-hidden">

//       {/* Scroll area */}
//       <div className="flex-1 overflow-y-auto space-y-6 pr-2 pb-20">

//         {formData.map((item, index) => (
//           <div key={index} className="border-b pb-6">
//             <label className="block font-medium text-sm mb-2">{item.name}</label>

//             {/* Score */}
//             <select
//               className="w-full border bg-background border-border rounded-md p-2 text-sm focus:ring-2 focus:ring-primary"
//               required
//               value={item.score}
//               onChange={(e) => handleChange(index, "score", e.target.value)}
//             >
//               <option value="">Select score</option>
//               <option value="0">0 - Not Completed</option>
//               <option value="1">1 - Beginning</option>
//               <option value="2">2 - Developing</option>
//               <option value="3">3 - Accomplished</option>
//               <option value="4">4 - Exemplary</option>
//             </select>

//             {/* Comments */}
//             <textarea
//               className="w-full mt-3 border bg-background border-border rounded-md p-2 text-sm resize-y focus:ring-2 focus:ring-primary"
//               placeholder={`Enter comments for ${item.name}`}
//               value={item.comment}
//               onChange={(e) => handleChange(index, "comment", e.target.value)}
//             />
//           </div>
//         ))}

//         {/* Overall feedback */}
//         <div>
//           <label className="block font-medium text-sm mb-2">Overall Feedback</label>
//           <textarea
//             className="w-full border bg-background border-border rounded-md p-2 text-sm resize-y focus:ring-2 focus:ring-primary"
//             placeholder="General remarks about the submission"
//             value={overallComment}
//             onChange={(e) => setOverallComment(e.target.value)}
//           />
//         </div>
// <div className="bg-background border-t border-border p-4 flex justify-end items-center">
//   <Button type="submit" className="px-6 font-medium rounded-lg">
//     Submit Assessment
//   </Button>
// </div>
//       </div>

//       {/* Sticky footer */}
  

//     </form>
//   );
// };

// export default MentorRubricAssessment;

// import { useState, useMemo } from "react";

// const criteriaData = [
//   {
//     title: "Paper Topic",
//     meta: "Clarity, focus, and alignment with theme.",
//     max: 4,
//     options: [
//       { label: "Emerging", score: 1 },
//       { label: "Developing", score: 2 },
//       { label: "Strong", score: 3 },
//       { label: "Exemplary", score: 4 },
//     ],
//   },
//   {
//     title: "Academic Research Articles",
//     meta: "Use of credible sources and synthesis of evidence.",
//     max: 4,
//     options: [
//       { label: "Minimal", score: 1 },
//       { label: "Basic", score: 2 },
//       { label: "Solid", score: 3 },
//       { label: "Rich", score: 4 },
//     ],
//   },
//   {
//     title: "Annotations",
//     meta: "Depth of notes and engagement with texts.",
//     max: 4,
//     options: [
//       { label: "Superficial", score: 1 },
//       { label: "Literal", score: 2 },
//       { label: "Interpretive", score: 3 },
//       { label: "Insightful", score: 4 },
//     ],
//   },
//   {
//     title: "Working Outline",
//     meta: "Logical structure and flow of argument.",
//     max: 4,
//     options: [
//       { label: "Fragmented", score: 1 },
//       { label: "Loose", score: 2 },
//       { label: "Coherent", score: 3 },
//       { label: "Elegant", score: 4 },
//     ],
//   },
//   {
//     title: "Creativity & Innovation",
//     meta: "Original framing, risk-taking, and imaginative solutions.",
//     max: 4,
//     options: [
//       { label: "Safe", score: 1 },
//       { label: "Cautious", score: 2 },
//       { label: "Inventive", score: 3 },
//       { label: "Bold", score: 4 },
//     ],
//   },
// ];

// export default function MentorRubric() {
//   const [mode, setMode] = useState("analytic");
//   const [scores, setScores] = useState({});
//   const [feedback, setFeedback] = useState({});
//   const [narrative, setNarrative] = useState("");

//   const completed = Object.keys(scores).length;

//   const total = Object.values(scores).reduce((a, b) => a + b, 0);
//   const maxTotal = criteriaData.reduce((a, b) => a + b.max, 0);
//   const progress = (completed / criteriaData.length) * 100;

//   const handleScore = (index, value) => {
//     setScores((prev) => ({ ...prev, [index]: value }));
//   };

//   const publishDisabled = completed !== criteriaData.length;

//   return (
//     <div className="grid grid-cols-[1.2fr_1.1fr] h-screen bg-[#020617] text-gray-200">

//       <div className="p-5 border-r border-slate-800">
//         <div className="flex justify-between text-xs text-gray-400 mb-2">
//           <div>Mentor Portal · Review</div>
//           <div>
//             Student: <b>Riya Sharma</b> · Grade 11
//           </div>
//         </div>

//         <div className="rounded-xl border border-slate-800 bg-black h-[calc(100vh-80px)] shadow-xl">
//           <div className="border-b border-slate-800 p-2 text-xs flex gap-2">
//             <span className="px-3 py-0.5 rounded-full border">(a…) 1 / 3</span>
//             <span className="px-3 py-0.5 rounded-full border">83%</span>
//             <span className="px-3 py-0.5 rounded-full border">⇵</span>
//             <span className="px-3 py-0.5 rounded-full border">⋯</span>
//           </div>
//           <div className="h-full flex items-center justify-center text-gray-500 text-sm">
//             Embed your PDF viewer here
//           </div>
//         </div>
//       </div>

//       {/* RIGHT RUBRIC */}
//       <div className="p-5 flex flex-col gap-4 overflow-hidden">
//         {/* HEADER */}
//         <div className="flex justify-between">
//           <div>
//             <h1 className="text-lg font-semibold">
//               Review Assignment — Position Paper 1
//             </h1>
//             <p className="text-xs text-gray-400 mt-1">
//               View the paper on the left. Score and coach the student on the
//               right.
//             </p>
//           </div>
//           <div className="text-xs text-right">
//             <div className="px-4 py-1 rounded-full border">
//               Total:{" "}
//               <span className="text-sky-400 font-semibold">
//                 {completed === 0 ? "–" : total} / {maxTotal}
//               </span>
//             </div>
//             <div className="text-gray-500 mt-1">Phase: Draft · Mentor review</div>
//           </div>
//         </div>

//         {/* MODE + PROGRESS */}
//         <div className="flex justify-between items-center">
//           <div className="flex bg-black border rounded-full p-1">
//             {["analytic", "narrative", "quick"].map((m) => (
//               <button
//                 key={m}
//                 onClick={() => setMode(m)}
//                 className={`px-4 py-1 rounded-full text-xs ${
//                   mode === m
//                     ? "bg-sky-500/20 text-sky-400"
//                     : "text-gray-400"
//                 }`}
//               >
//                 {m === "analytic"
//                   ? "Analytic (Harvard)"
//                   : m === "narrative"
//                   ? "Narrative (Oxford)"
//                   : "Quick Check"}
//               </button>
//             ))}
//           </div>

//           <div className="text-xs text-gray-400 text-right min-w-[140px]">
//             <div>
//               {completed} / {criteriaData.length} completed
//             </div>
//             <div className="w-full h-1 bg-gray-900 rounded-full mt-1">
//               <div
//                 className="h-full bg-gradient-to-r from-sky-300 to-sky-500 rounded-full transition-all"
//                 style={{ width: `${progress}%` }}
//               />
//             </div>
//           </div>
//         </div>

//         {/* SCROLL AREA */}
//         <div className="flex-1 overflow-y-auto pr-2 space-y-3">
//           {/* ANALYTIC MODE */}
//           {mode !== "narrative" &&
//             criteriaData.map((c, i) => (
//               <div
//                 key={i}
//                 className={`border rounded-xl p-4 bg-black ${
//                   scores[i] ? "border-sky-500/40" : "border-slate-800"
//                 }`}
//               >
//                 <div className="flex justify-between mb-2 text-sm">
//                   <div>
//                     <div className="font-medium">{c.title}</div>
//                     <div className="text-xs text-gray-400">{c.meta}</div>
//                   </div>
//                   <div className="text-xs text-gray-400">
//                     {scores[i]
//                       ? `Scored: ${scores[i]} / ${c.max}`
//                       : "Not scored"}
//                   </div>
//                 </div>

//                 <div className="grid grid-cols-4 gap-2 mb-3">
//                   {c.options.map((opt) => (
//                     <button
//                       key={opt.score}
//                       onClick={() => handleScore(i, opt.score)}
//                       className={`text-xs py-1 rounded-full border transition ${
//                         scores[i] === opt.score
//                           ? "bg-sky-500/20 border-sky-500 text-sky-400"
//                           : "border-slate-700 text-gray-400"
//                       }`}
//                     >
//                       {opt.label} ({opt.score})
//                     </button>
//                   ))}
//                 </div>

//                 {mode === "analytic" && (
//                   <div className="grid grid-cols-3 gap-2">
//                     {["Worked well", "To improve", "Next experiment"].map(
//                       (label, fIndex) => (
//                         <textarea
//                           key={fIndex}
//                           placeholder={label}
//                           className="bg-black border border-slate-800 rounded-md p-2 text-xs resize-none"
//                           onChange={(e) =>
//                             setFeedback((prev) => ({
//                               ...prev,
//                               [`${i}-${fIndex}`]: e.target.value,
//                             }))
//                           }
//                         />
//                       )
//                     )}
//                   </div>
//                 )}
//               </div>
//             ))}

//           {/* NARRATIVE MODE */}
//           {mode === "narrative" && (
//             <div className="border border-slate-800 rounded-xl p-4 bg-black">
//               <div className="font-medium mb-1">
//                 Narrative feedback (Oxford style)
//               </div>
//               <div className="text-xs text-gray-400 mb-2">
//                 Write a short supervision-style report.
//               </div>
//               <textarea
//                 value={narrative}
//                 onChange={(e) => setNarrative(e.target.value)}
//                 className="w-full min-h-[140px] bg-black border border-slate-800 rounded-md p-2 text-xs"
//                 placeholder="Dear Riya,..."
//               />
//             </div>
//           )}
//         </div>

//         {/* FOOTER */}
//         <div className="border-t border-slate-800 pt-3 flex justify-between items-center text-xs">
//           <div className="flex gap-2">
//             <button className="px-4 py-1 rounded-full border">
//               Save Draft
//             </button>
//             <button className="px-4 py-1 rounded-full border">
//               Preview as Student
//             </button>
//           </div>

//           <div className="flex gap-2 items-center">
//             <span className="text-gray-500">
//               HOD will review once you publish.
//             </span>
//             <button
//               disabled={publishDisabled}
//               className={`px-5 py-1 rounded-full font-semibold ${
//                 publishDisabled
//                   ? "bg-gray-700 text-gray-400"
//                   : "bg-gradient-to-r from-sky-500 to-emerald-500 text-black"
//               }`}
//             >
//               Publish Assessment
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }


import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";

interface MentorRubricAssessmentProps {
  onSubmit: (rubricData: any) => void;
}

const criteriaData = [
  {
    key: "paper_topic",
    title: "Paper Topic",
    meta: "Clarity, focus, and alignment with theme.",
    max: 4,
    options: [
      { label: "Emerging", score: 1 },
      { label: "Developing", score: 2 },
      { label: "Strong", score: 3 },
      { label: "Exemplary", score: 4 },
    ],
  },
  {
    key: "research",
    title: "Academic Research Articles",
    meta: "Use of credible sources and synthesis of evidence.",
    max: 4,
    options: [
      { label: "Minimal", score: 1 },
      { label: "Basic", score: 2 },
      { label: "Solid", score: 3 },
      { label: "Rich", score: 4 },
    ],
  },
  {
    key: "annotations",
    title: "Annotations",
    meta: "Depth of notes and engagement with texts.",
    max: 4,
    options: [
      { label: "Superficial", score: 1 },
      { label: "Literal", score: 2 },
      { label: "Interpretive", score: 3 },
      { label: "Insightful", score: 4 },
    ],
  },
  {
    key: "outline",
    title: "Working Outline",
    meta: "Logical structure and flow of argument.",
    max: 4,
    options: [
      { label: "Fragmented", score: 1 },
      { label: "Loose", score: 2 },
      { label: "Coherent", score: 3 },
      { label: "Elegant", score: 4 },
    ],
  },
  {
    key: "creativity",
    title: "Creativity & Innovation",
    meta: "Original framing, risk-taking, and imaginative solutions.",
    max: 4,
    options: [
      { label: "Safe", score: 1 },
      { label: "Cautious", score: 2 },
      { label: "Inventive", score: 3 },
      { label: "Bold", score: 4 },
    ],
  },
];

export default function MentorRubricAssessment({
  onSubmit,
}: MentorRubricAssessmentProps) {
  const [mode, setMode] = useState<"analytic" | "narrative" | "quick">(
    "analytic"
  );
  const [scores, setScores] = useState<Record<string, number>>({});
  const [feedback, setFeedback] = useState<Record<string, any>>({});
  const [narrative, setNarrative] = useState("");

  const completed = Object.keys(scores).length;

  const total = Object.values(scores).reduce((a, b) => a + b, 0);
  const maxTotal = criteriaData.reduce((a, b) => a + b.max, 0);
  const progress = (completed / criteriaData.length) * 100;

  const canPublish = completed === criteriaData.length;

  const handleScore = (key: string, value: number) => {
    setScores((prev) => ({ ...prev, [key]: value }));
  };

  const handleFeedbackChange = (
    criterionKey: string,
    field: string,
    value: string
  ) => {
    setFeedback((prev) => ({
      ...prev,
      [criterionKey]: {
        ...prev[criterionKey],
        [field]: value,
      },
    }));
  };

  const handlePublish = () => {
    const payload = {
      mode,
      totalScore: total,
      maxScore: maxTotal,
      scores,
      feedback,
      narrative,
      submittedAt: new Date().toISOString(),
    };

    onSubmit(payload); // ✅ THIS GOES TO MentorDashboard
  };

  return (
    <div className="flex flex-col h-full">
      {/* HEADER */}
      <div className="flex justify-between mb-3">
        <div>
          <h2 className="text-base font-semibold">Rubric Assessment</h2>
          <p className="text-xs text-muted-foreground">
            Score and provide feedback below.
          </p>
        </div>
        <div className="text-xs">
          <span className="px-3 py-1 border rounded-full">
            Total:{" "}
            <b className="text-primary">
              {completed === 0 ? "–" : total} / {maxTotal}
            </b>
          </span>
        </div>
      </div>

      {/* MODE + PROGRESS */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex bg-muted rounded-full p-1">
          {["analytic", "narrative", "quick"].map((m) => (
            <button
              key={m}
              onClick={() => setMode(m as any)}
              className={`px-4 py-1 text-xs rounded-full ${
                mode === m
                  ? "bg-primary text-white"
                  : "text-muted-foreground"
              }`}
            >
              {m === "analytic"
                ? "Analytic"
                : m === "narrative"
                ? "Narrative"
                : "Quick"}
            </button>
          ))}
        </div>

        <div className="text-xs text-muted-foreground text-right min-w-[120px]">
          <div>
            {completed} / {criteriaData.length} completed
          </div>
          <div className="w-full h-1 bg-muted rounded-full mt-1">
            <div
              className="h-full bg-primary rounded-full transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      {/* BODY */}
      <div className="flex-1 overflow-y-auto space-y-3 pr-1">
        {mode !== "narrative" &&
          criteriaData.map((c) => (
            <div
              key={c.key}
              className="border rounded-lg p-3 bg-background"
            >
              <div className="flex justify-between mb-2 text-sm">
                <div>
                  <div className="font-medium">{c.title}</div>
                  <div className="text-xs text-muted-foreground">
                    {c.meta}
                  </div>
                </div>
                <div className="text-xs text-muted-foreground">
                  {scores[c.key]
                    ? `Scored: ${scores[c.key]} / ${c.max}`
                    : "Not scored"}
                </div>
              </div>

              <div className="grid grid-cols-4 gap-2 mb-2">
                {c.options.map((opt) => (
                  <button
                    key={opt.score}
                    onClick={() => handleScore(c.key, opt.score)}
                    className={`text-xs py-1 rounded-full border ${
                      scores[c.key] === opt.score
                        ? "bg-primary/10 border-primary text-primary"
                        : "border-border text-muted-foreground"
                    }`}
                  >
                    {opt.label} ({opt.score})
                  </button>
                ))}
              </div>

              {mode === "analytic" && (
                <div className="grid grid-cols-3 gap-2">
                  {[
                    "worked_well",
                    "to_improve",
                    "next_experiment",
                  ].map((field, fIdx) => (
                    <textarea
                      key={field}
                      placeholder={
                        fIdx === 0
                          ? "What worked well"
                          : fIdx === 1
                          ? "What to improve"
                          : "Next experiment"
                      }
                      className="bg-black border border-slate-800 rounded-md p-2 text-xs resize-none"
                      onChange={(e) =>
                        handleFeedbackChange(
                          c.key,
                          field,
                          e.target.value
                        )
                      }
                    />
                  ))}
                </div>
              )}
            </div>
          ))}

        {/* NARRATIVE MODE */}
        {mode === "narrative" && (
          <div className="border rounded-lg p-3">
            <div className="font-medium mb-1">
              Narrative Feedback
            </div>
            <textarea
              value={narrative}
              onChange={(e) => setNarrative(e.target.value)}
              className="bg-black border border-slate-800 rounded-md p-2 text-xs w-full"
              placeholder="Dear student,…"
            />
          </div>
        )}
      </div>

      {/* FOOTER */}
      <div className="border-t pt-3 flex justify-between items-center">
        <span className="text-xs text-muted-foreground">
          HOD will review once you publish.
        </span>

        <Button onClick={handlePublish} disabled={!canPublish}>
          Publish Assessment
        </Button>
      </div>
    </div>
  );
}
