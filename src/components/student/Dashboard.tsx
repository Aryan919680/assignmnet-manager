"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const data = [
  { name: "Week 1", progress: 60 },
  { name: "Week 2", progress: 68 },
  { name: "Week 3", progress: 72 },
  { name: "Week 4", progress: 80 },
  { name: "Week 5", progress: 85 },
  { name: "Week 6", progress: 90 },
];

const Dashboard = () => {
  return (
    <section id="dashboard" className="p-6 bg-muted/30 min-h-screen rounded-lg">
      <div className="flex justify-between items-start gap-6 flex-wrap">
        {/* Left Section */}
        <div className="flex-1 min-w-[320px]">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="font-bold text-2xl">Dashboard</h2>
              <p className="text-sm text-muted-foreground">
                Your next action & progress at a glance
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm">
                Welcome back, <strong>Student Name</strong>
              </p>
              <p className="text-xs text-muted-foreground" id="lastSavedLabel"></p>
            </div>
          </div>

          {/* KPI Row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card className="shadow-sm">
              <CardContent className="pt-4 pb-3">
                <p className="text-sm text-muted-foreground">Next Due</p>
                <p id="kpiNext" className="text-2xl font-extrabold text-primary mt-1">
                  —
                </p>
              </CardContent>
            </Card>
            <Card className="shadow-sm">
              <CardContent className="pt-4 pb-3">
                <p className="text-sm text-muted-foreground">Pending Feedback</p>
                <p id="kpiPending" className="text-2xl font-extrabold text-primary mt-1">
                  0
                </p>
              </CardContent>
            </Card>
            <Card className="shadow-sm">
              <CardContent className="pt-4 pb-3">
                <p className="text-sm text-muted-foreground">Iterations Open</p>
                <p id="kpiIter" className="text-2xl font-extrabold text-primary mt-1">
                  0
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Today Action */}
          <Card className="mt-6 shadow-sm">
            <CardHeader className="flex flex-row justify-between items-center">
              <CardTitle className="text-base font-bold">
                Today — Your Next Action
              </CardTitle>
              <span className="text-xs text-muted-foreground">Priority</span>
            </CardHeader>
            <CardContent>
              <div id="todayAction" className="text-sm text-muted-foreground">
                No pending actions — great job!
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Section */}
        <div className="w-full sm:w-80 flex flex-col gap-6 mt-6 sm:mt-0">
          {/* Progress Trend */}
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="text-base font-bold">
                Progress Trend
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-40 mt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" className="opacity-40" />
                    <XAxis
                      dataKey="name"
                      tick={{ fontSize: 12 }}
                      stroke="currentColor"
                      className="text-muted-foreground"
                    />
                    <YAxis
                      domain={[0, 100]}
                      tick={{ fontSize: 12 }}
                      stroke="currentColor"
                      className="text-muted-foreground"
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        fontSize: "0.75rem",
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="progress"
                      stroke="hsl(var(--primary))"
                      strokeWidth={2}
                      dot={{ r: 4, fill: "hsl(var(--primary))" }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <p className="text-sm text-muted-foreground mt-3">
                Improvement over last submissions
              </p>
            </CardContent>
          </Card>

          {/* Badges */}
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="text-base font-bold">Badges</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2 mt-1">
                <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
                  Writing
                </span>
                <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
                  Critical Thinking
                </span>
              </div>
              <p className="text-sm text-muted-foreground mt-3">
                Earn badges to add to your portfolio
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default Dashboard;
