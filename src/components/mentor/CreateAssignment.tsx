import React, { useState } from "react";

const CreateAssignment: React.FC = () => {
  const [title, setTitle] = useState("");
  const [classSection, setClassSection] = useState("");
  const [subject, setSubject] = useState("");
  const [instructions, setInstructions] = useState("");
  const [deadline, setDeadline] = useState("");
  const [allowLate, setAllowLate] = useState(false);
  const [rubric, setRubric] = useState("default");

  return (
    <div className="min-h-screen bg-[#0f172a] text-white p-8">
      <h1 className="text-2xl font-semibold">
        Mentor — Create Assignment & Deadlines
      </h1>
      <p className="text-sm text-gray-400 mb-6">
        Publish to class, set deadline, and control late submissions. Fully
        client-side demo.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Side — Form */}
        <div className="bg-[#1e293b] rounded-xl p-6 space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="font-semibold text-lg">New Assignment</h2>
            <span className="text-sm text-gray-400">
              Required fields marked <span className="text-orange-400">*</span>
            </span>
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Title <span className="text-orange-400">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g., Position Paper — Sustainability"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-[#0f172a] border border-gray-700 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          {/* Class & Subject */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Class / Section <span className="text-orange-400">*</span>
              </label>
              <select
                value={classSection}
                onChange={(e) => setClassSection(e.target.value)}
                className="w-full bg-[#0f172a] border border-gray-700 rounded-lg p-2 text-sm"
              >
                <option value="">Select...</option>
                <option value="10A">10A</option>
                <option value="10B">10B</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Subject <span className="text-orange-400">*</span>
              </label>
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full bg-[#0f172a] border border-gray-700 rounded-lg p-2 text-sm"
              >
                <option value="">Select...</option>
                <option value="Science">Science</option>
                <option value="Math">Math</option>
              </select>
            </div>
          </div>

          {/* Instructions */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Instructions / Brief <span className="text-orange-400">*</span>
            </label>
            <textarea
              placeholder="What should students deliver? Format, word count, references, rubric notes..."
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              rows={4}
              className="w-full bg-[#0f172a] border border-gray-700 rounded-lg p-2 text-sm resize-none"
            />
          </div>

          {/* Deadline & Rubric */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Deadline (date & time) <span className="text-orange-400">*</span>
              </label>
              <input
                type="datetime-local"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="w-full bg-[#0f172a] border border-gray-700 rounded-lg p-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Rubric Template
              </label>
              <select
                value={rubric}
                onChange={(e) => setRubric(e.target.value)}
                className="w-full bg-[#0f172a] border border-gray-700 rounded-lg p-2 text-sm"
              >
                <option value="default">
                  Default (Originality / Rigor / Format)
                </option>
                <option value="simple">Simple Rubric</option>
              </select>
            </div>
          </div>

          {/* Late submission */}
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={allowLate}
              onChange={(e) => setAllowLate(e.target.checked)}
              className="accent-orange-500"
            />
            <label className="text-sm font-medium">Allow Late Submissions</label>
          </div>

          {/* Buttons */}
          <div className="flex space-x-3 pt-2">
            <button className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg text-sm font-medium">
              Preview
            </button>
            <button className="bg-orange-600 hover:bg-orange-500 px-4 py-2 rounded-lg text-sm font-medium">
              Publish to Class
            </button>
            <button className="bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-lg text-sm font-medium">
              Clear
            </button>
          </div>

          <p className="text-xs text-gray-500">
            Tip: Use <b>Ctrl/Cmd + S</b> to quick-save your draft while filling.
          </p>
        </div>

        {/* Right Side — Live Preview */}
        <div className="bg-[#1e293b] rounded-xl p-6 space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="font-semibold text-lg">Live Preview & Status</h2>
            <span className="text-sm text-orange-400">Fill all required fields</span>
          </div>

          <div className="space-y-4 text-sm">
            <div className="bg-[#0f172a] p-3 rounded-lg">
              <div>
                <b>Title:</b> {title || "—"}
              </div>
              <div>
                Class: {classSection || "—"} • Subject: {subject || "—"}
              </div>
            </div>

            <div className="bg-[#0f172a] p-3 rounded-lg">
              <div>
                <b>Deadline:</b> {deadline ? new Date(deadline).toLocaleString() : "—"}
              </div>
              <div>Countdown: —</div>
            </div>

            <div className="bg-[#0f172a] p-3 rounded-lg">
              <b>Brief:</b> <p className="text-gray-300">{instructions || "—"}</p>
            </div>

            <div className="bg-[#0f172a] p-3 rounded-lg">
              <b>Rules:</b>{" "}
              <span>
                Late: {allowLate ? "Allowed" : "Not allowed"} • Max attempts: 2
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-[#1e293b] rounded-xl p-6 mt-6">
        <h2 className="font-semibold mb-2">Assignments You Published</h2>
        <p className="text-gray-400 text-sm">
          No assignments yet. Create one above.
        </p>
        <p className="text-xs text-gray-500 mt-3">
          Manage deadlines, allow late, close or extend.
        </p>
      </div>
    </div>
  );
};

export default CreateAssignment;
