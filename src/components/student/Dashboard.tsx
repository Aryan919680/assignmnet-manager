
const Dashboard = () => {
  return (
    <section id="dashboard" className="panel" role="region">
      <div className="flex justify-between items-start gap-3">
        {/* Left Section */}
        <div className="flex-1">
          <div className="flex justify-between items-center">
            <div>
              <div className="font-bold text-lg">Dashboard</div>
              <div className="text-muted mt-1">Your next action & progress at a glance</div>
            </div>
            <div className="text-right">
              <div className="text-sm">
                Welcome back, <strong>Student Name</strong>
              </div>
              <div className="text-sm text-muted" id="lastSavedLabel"></div>
            </div>
          </div>

          {/* KPI Row */}
          <div className="flex gap-4 mt-3">
            <div className="panel flex-1">
              <div className="text-sm">Next Due</div>
              <div className="font-extrabold mt-1" id="kpiNext">
                —
              </div>
            </div>
            <div className="panel flex-1">
              <div className="text-sm">Pending Feedback</div>
              <div className="font-extrabold mt-1" id="kpiPending">
                0
              </div>
            </div>
            <div className="panel flex-1">
              <div className="text-sm">Iterations Open</div>
              <div className="font-extrabold mt-1" id="kpiIter">
                0
              </div>
            </div>
          </div>

          {/* Today Action */}
          <div className="panel mt-3">
            <div className="flex justify-between items-center">
              <div className="font-bold">Today — Your next action</div>
              <div className="text-muted text-sm">Priority</div>
            </div>
            <div id="todayAction" className="mt-2">
              No pending actions — great job!
            </div>
          </div>
        </div>

        {/* Right Section */}
        <div className="w-80">
          {/* Progress Trend */}
          <div className="panel">
            <div className="font-bold">Progress trend</div>
            <canvas id="trend" height="120" className="mt-2"></canvas>
            <div className="text-muted text-sm mt-2">
              Improvement over last submissions
            </div>
          </div>

          {/* Badges */}
          <div className="panel mt-3">
            <div className="font-bold">Badges</div>
            <div className="flex flex-wrap gap-2 mt-2">
              <div className="chip">Writing</div>
              <div className="chip">Critical Thinking</div>
            </div>
            <div className="text-muted text-sm mt-2">
              Earn badges to add to portfolio
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Dashboard;
