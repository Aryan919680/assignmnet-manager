// import { useState, useEffect } from "react";
// import { User } from "@supabase/supabase-js";
// import { supabase } from "@/integrations/supabase/client";
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
// import { Badge } from "@/components/Badge";
// import { FileText, User as UserIcon, TrendingUp, CheckCircle, Clock, XCircle } from "lucide-react";

// interface Review {
//   marks: number;
//   comments: string;
//   reviewer_role: string;
// }

// interface Assignment {
//   id: string;
//   title: string;
//   description: string;
//   status: string;
//   created_at: string;
//   profiles: { full_name: string; email: string };
//   reviews: Review[];
// }

// interface PrincipalDashboardProps {
//   user: User;
// }

// export default function PrincipalDashboard({ user }: PrincipalDashboardProps) {
//   const [assignments, setAssignments] = useState<Assignment[]>([]);
//   const [stats, setStats] = useState({ total: 0, approved: 0, pending: 0, rejected: 0 });

//   useEffect(() => {
//     fetchAssignments();
//     fetchStats();
//   }, []);

//   const fetchAssignments = async () => {
//     const { data } = await supabase
//       .from("assignments")
//       .select(`
//         *,
//         profiles:student_id (full_name, email),
//         reviews (marks, comments, reviewer_role)
//       `)
//       .order("created_at", { ascending: false })
//       .limit(20);

//     if (data) setAssignments(data as any);
//   };

//   const fetchStats = async () => {
//     const { count: total } = await supabase
//       .from("assignments")
//       .select("*", { count: "exact", head: true });

//     const { count: approved } = await supabase
//       .from("assignments")
//       .select("*", { count: "exact", head: true })
//       .eq("status", "approved");

//     const { count: pending } = await supabase
//       .from("assignments")
//       .select("*", { count: "exact", head: true })
//       .in("status", ["pending", "mentor_review", "hod_review"]);

//     const { count: rejected } = await supabase
//       .from("assignments")
//       .select("*", { count: "exact", head: true })
//       .eq("status", "rejected");

//     setStats({
//       total: total || 0,
//       approved: approved || 0,
//       pending: pending || 0,
//       rejected: rejected || 0,
//     });
//   };

//   const getStatusBadge = (status: string) => {
//     switch (status) {
//       case "approved":
//         return <Badge variant="success">Approved</Badge>;
//       case "rejected":
//         return <Badge variant="destructive">Rejected</Badge>;
//       case "pending":
//         return <Badge variant="warning">Pending Review</Badge>;
//       case "mentor_review":
//         return <Badge variant="secondary">With Mentor</Badge>;
//       case "hod_review":
//         return <Badge variant="secondary">With HOD</Badge>;
//       default:
//         return <Badge>{status}</Badge>;
//     }
//   };

//   return (
//     <div className="container mx-auto px-4 py-8">
//       <div className="mb-8">
//         <h2 className="text-3xl font-bold">Principal Dashboard</h2>
//         <p className="text-muted-foreground">Overview of all assignments and progress</p>
//       </div>

//       <div className="mb-8 grid gap-4 md:grid-cols-4">
//         <Card className="border-primary/20">
//           <CardHeader className="flex flex-row items-center justify-between pb-2">
//             <CardTitle className="text-sm font-medium">Total Assignments</CardTitle>
//             <TrendingUp className="h-4 w-4 text-muted-foreground" />
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold">{stats.total}</div>
//           </CardContent>
//         </Card>
//         <Card className="border-success/20">
//           <CardHeader className="flex flex-row items-center justify-between pb-2">
//             <CardTitle className="text-sm font-medium">Approved</CardTitle>
//             <CheckCircle className="h-4 w-4 text-success" />
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold text-success">{stats.approved}</div>
//           </CardContent>
//         </Card>
//         <Card className="border-warning/20">
//           <CardHeader className="flex flex-row items-center justify-between pb-2">
//             <CardTitle className="text-sm font-medium">Pending</CardTitle>
//             <Clock className="h-4 w-4 text-warning" />
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold text-warning">{stats.pending}</div>
//           </CardContent>
//         </Card>
//         <Card className="border-destructive/20">
//           <CardHeader className="flex flex-row items-center justify-between pb-2">
//             <CardTitle className="text-sm font-medium">Rejected</CardTitle>
//             <XCircle className="h-4 w-4 text-destructive" />
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold text-destructive">{stats.rejected}</div>
//           </CardContent>
//         </Card>
//       </div>

//       <div className="space-y-4">
//         <h3 className="text-xl font-semibold">Recent Assignments</h3>
//         {assignments.map((assignment) => (
//           <Card key={assignment.id} className="border-border/50">
//             <CardHeader>
//               <div className="flex items-start justify-between">
//                 <div>
//                   <CardTitle className="text-lg">{assignment.title}</CardTitle>
//                   <CardDescription className="mt-1">{assignment.description}</CardDescription>
//                   <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
//                     <UserIcon className="h-4 w-4" />
//                     <span>{assignment.profiles.full_name}</span>
//                   </div>
//                   {assignment.reviews.length > 0 && (
//                     <div className="mt-3 space-y-2">
//                       {assignment.reviews.map((review, idx) => (
//                         <div key={idx} className="rounded-lg bg-muted/50 p-2 text-sm">
//                           <span className="font-semibold capitalize">{review.reviewer_role}:</span>
//                           {review.marks && <span className="ml-2">Marks: {review.marks}/100</span>}
//                           {review.comments && <p className="mt-1 text-muted-foreground">{review.comments}</p>}
//                         </div>
//                       ))}
//                     </div>
//                   )}
//                 </div>
//                 {getStatusBadge(assignment.status)}
//               </div>
//             </CardHeader>
//             <CardContent>
//               <div className="flex items-center gap-2 text-sm text-muted-foreground">
//                 <FileText className="h-4 w-4" />
//                 <span>Submitted on {new Date(assignment.created_at).toLocaleDateString()}</span>
//               </div>
//             </CardContent>
//           </Card>
//         ))}
//       </div>
//     </div>
//   );
// }


import React, { useState } from "react";
import {
  Doughnut,
  Bar,
  Line,
  Pie
} from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";

ChartJS.register(
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const PrincipalDashboard = () => {
  const [active, setActive] = useState("overview");

  const dummyProjects = [
    { title: "Optimizing Crop Yields (AgriTech)", score: 91 },
    { title: "Remote Diagnostics AI (MedTech)", score: 88 },
    { title: "Personalized eLearning", score: 85 },
    { title: "Microgrid Solar Design", score: 79 },
  ];

  return (
    <div className="flex min-h-screen bg-gray-100 font-inter">
      {/* Sidebar */}
      <aside className="w-60 bg-slate-900 text-slate-100 flex flex-col p-5">
        <h2 className="text-xl font-semibold mb-6">Webiosis</h2>
        {[
          "overview",
          "analytics",
          "metrics",
          "reports",
          "communicate",
          "csr",
        ].map((view) => (
          <button
            key={view}
            onClick={() => setActive(view)}
            className={`w-full text-left px-5 py-2.5 rounded-md capitalize transition-colors ${
              active === view
                ? "bg-slate-800 text-white"
                : "hover:bg-slate-800 text-slate-200"
            }`}
          >
            {view}
          </button>
        ))}
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        {/* Header */}
        <header className="flex justify-between items-center px-6 py-4 bg-white shadow">
          <h1 className="text-lg font-semibold">Principal Dashboard</h1>
        </header>

        {/* Content */}
        <section className="flex-1 overflow-y-auto p-6">
          {/* Overview */}
          {active === "overview" && (
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              <ChartCard title="Assessment Lifecycle">
                <Doughnut
                  data={{
                    labels: [
                      "Submitted",
                      "Mentor Review",
                      "Lead Verification",
                      "HOD Approval",
                      "Revisions",
                    ],
                    datasets: [
                      {
                        label: "Count",
                        data: [70, 50, 40, 30, 20],
                        backgroundColor: [
                          "#1f6feb",
                          "#16a085",
                          "#f59e0b",
                          "#8b5cf6",
                          "#ef4444",
                        ],
                      },
                    ],
                  }}
                  options={{ plugins: { legend: { position: "bottom" } } }}
                />
              </ChartCard>

              <ChartCard title="Rubric Performance">
                <Bar
                  data={{
                    labels: [
                      "Innovation",
                      "Research",
                      "Presentation",
                      "Documentation",
                    ],
                    datasets: [
                      {
                        label: "Avg Score",
                        data: [75, 80, 65, 70],
                        backgroundColor: "#2563eb",
                      },
                    ],
                  }}
                  options={{
                    scales: { y: { beginAtZero: true, max: 100 } },
                  }}
                />
              </ChartCard>

              <ChartCard title="Submission Metrics">
                <Line
                  data={{
                    labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
                    datasets: [
                      {
                        label: "Submitted",
                        data: [20, 40, 35, 50],
                        borderColor: "#fb923c",
                        backgroundColor: "#fde68a",
                        fill: false,
                        tension: 0.3,
                      },
                    ],
                  }}
                  options={{ scales: { y: { beginAtZero: true } } }}
                />
              </ChartCard>
            </div>
          )}

          {/* Analytics */}
          {active === "analytics" && (
            <div className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <ChartCard title="Innovation Trend (Past 4 years)">
                  <Line
                    data={{
                      labels: ["2021", "2022", "2023", "2024", "2025"],
                      datasets: [
                        {
                          label: "Innovation Index",
                          data: [55, 62, 68, 81, 90],
                          borderColor: "#10b981",
                          backgroundColor: "#d1fae5",
                          fill: true,
                          tension: 0.4,
                        },
                      ],
                    }}
                    options={{
                      scales: { y: { beginAtZero: true, max: 100 } },
                    }}
                  />
                </ChartCard>

                <ChartCard title="Innovation by Topic">
                  <Bar
                    data={{
                      labels: [
                        "AI/ML",
                        "AgriTech",
                        "MedTech",
                        "eLearning",
                        "Clean Energy",
                      ],
                      datasets: [
                        {
                          label: "Innovation Score",
                          data: [88, 71, 85, 67, 74],
                          backgroundColor: "#6366f1",
                        },
                      ],
                    }}
                    options={{
                      scales: { y: { beginAtZero: true, max: 100 } },
                    }}
                  />
                </ChartCard>
              </div>

              <div className="bg-white rounded-lg shadow p-5">
                <h3 className="font-semibold mb-3 text-gray-700">
                  Top Innovative Projects
                </h3>
                <ul className="list-disc pl-5 space-y-1 text-gray-600">
                  {dummyProjects.map((p) => (
                    <li key={p.title}>
                      <b>{p.title}</b> — Innovation Score: {p.score}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* Metrics */}
          {active === "metrics" && (
            <div>
              <h2 className="text-xl font-semibold mb-3">
                Workflows: Progress
              </h2>
              <ul className="list-disc pl-5 text-gray-700 space-y-1">
                <li>
                  Track project-by-project rubric progress with drill-down
                </li>
                <li>Department-level approvals and bottleneck alerts</li>
                <li>Mentor activity dashboard</li>
              </ul>
            </div>
          )}

          {/* Reports */}
          {active === "reports" && (
            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow p-5">
                <h3 className="font-semibold mb-3 text-gray-700">
                  Innovation Reports
                </h3>
                <ul className="list-disc pl-5 text-gray-600 space-y-1">
                  <li>
                    <b>Download:</b> PDF/CSV by department/topic/mentor
                  </li>
                  <li>Presentation status and scheduling export</li>
                  <li>Cross-year comparison of innovation impact</li>
                </ul>
              </div>

              <ChartCard title="Consolidated Topic Innovation (2021–2025)">
                <Bar
                  data={{
                    labels: [
                      "AI/ML",
                      "AgriTech",
                      "MedTech",
                      "eLearning",
                      "Clean Energy",
                    ],
                    datasets: [
                      {
                        label: "Projects",
                        data: [18, 12, 15, 8, 10],
                        backgroundColor: "#f97316",
                      },
                    ],
                  }}
                  options={{ scales: { y: { beginAtZero: true } } }}
                />
              </ChartCard>
            </div>
          )}

          {/* Communicate */}
          {active === "communicate" && (
            <div>
              <h2 className="text-xl font-semibold mb-3">
                Send Announcement / Notification
              </h2>
              <textarea
                placeholder="Write your message..."
                className="w-full h-28 border border-gray-300 rounded-lg p-3 text-gray-700"
              />
              <button
                className="mt-4 bg-blue-600 text-white px-5 py-2 rounded-md hover:bg-blue-700"
                onClick={() => alert("Announcement sent! (Demo)")}
              >
                Send
              </button>
            </div>
          )}

          {/* CSR Manager */}
          {active === "csr" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold mb-3">CSR Manager</h2>
                <ul className="list-disc pl-5 text-gray-700 space-y-1">
                  <li>Track projects eligible for CSR reporting</li>
                  <li>
                    Download/Export CSR contributions and social impact reports
                  </li>
                  <li>View history and track compliance</li>
                </ul>
              </div>

              <ChartCard title="CSR-Linked Innovation Impact">
                <Pie
                  data={{
                    labels: [
                      "Healthcare",
                      "Education",
                      "Environment",
                      "Women Empowerment",
                    ],
                    datasets: [
                      {
                        label: "Projects",
                        data: [6, 8, 5, 4],
                        backgroundColor: [
                          "#009688",
                          "#1976d2",
                          "#ffb300",
                          "#d32f2f",
                        ],
                      },
                    ],
                  }}
                  options={{ plugins: { legend: { position: "bottom" } } }}
                />
              </ChartCard>
            </div>
          )}
        </section>

        {/* Footer */}
        <footer className="bg-white py-3 px-6 text-right text-sm text-gray-500 border-t">
          © 2025 Webiosis. All rights reserved.
        </footer>
      </main>
    </div>
  );
};

// Reusable Chart Card Component
const ChartCard = ({ title, children }) => (
  <div className="bg-white rounded-lg shadow p-5">
    <h3 className="font-semibold mb-3 text-gray-700">{title}</h3>
    {children}
  </div>
);

export default PrincipalDashboard;
