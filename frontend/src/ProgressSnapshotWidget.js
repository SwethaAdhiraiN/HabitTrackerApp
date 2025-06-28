import React from "react";
import "./styles/Dashboard.module.css";

/**
 * PUBLIC_INTERFACE
 * ProgressSnapshotWidget: Visual summary of user's overall stats.
 * Shows streak, total comlpete, progress ring.
 */
function ProgressSnapshotWidget({ progress }) {
  if (!progress)
    return (
      <section className="dashboard-card progress-snapshot">
        <div className="dashboard-card-title">Progress Snapshot</div>
        <div style={{ color: "#aaa", minHeight: 50 }}>Loading stats...</div>
      </section>
    );
  const { streak = 0, completion_rate = 0, total_completed = 0, habits_tracked = 0 } = progress;
  const ring = (rate) => (
    <svg width="60" height="60" viewBox="0 0 60 60">
      <circle
        cx="30"
        cy="30"
        r="25"
        fill="none"
        stroke="#EFE4FA"
        strokeWidth="7"
      />
      <circle
        cx="30"
        cy="30"
        r="25"
        fill="none"
        stroke="#47DB7F"
        strokeWidth="7"
        strokeDasharray={2 * Math.PI * 25}
        strokeDashoffset={(1 - rate / 100) * 2 * Math.PI * 25}
        style={{ transition: "stroke-dashoffset 700ms" }}
        strokeLinecap="round"
      />
      <text x="30" y="36" textAnchor="middle" fontSize="1.6em" fontWeight={700} fill="#45377F">{Math.round(rate)}%</text>
    </svg>
  );
  return (
    <section className="dashboard-card progress-snapshot">
      <div className="dashboard-card-title">Progress Snapshot</div>
      <div className="progress-snapshot-row">
        <div className="progress-snapshot-ring">{ring(completion_rate)}</div>
        <div className="progress-snapshot-metrics">
          <div>
            <span className="progress-snapshot-label">Current Streak:</span>
            <span className="progress-snapshot-value">{streak} days</span>
          </div>
          <div>
            <span className="progress-snapshot-label">Completed:</span>
            <span className="progress-snapshot-value">{total_completed}</span>
          </div>
          <div>
            <span className="progress-snapshot-label">Habits Tracked:</span>
            <span className="progress-snapshot-value">{habits_tracked}</span>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ProgressSnapshotWidget;
