import React from "react";
import "./styles/Dashboard.module.css";

/**
 * PUBLIC_INTERFACE
 * MiniCalendarWidget: Section card wraps any calendar/emotion modules.
 */
function MiniCalendarWidget({ children }) {
  return (
    <section className="dashboard-card minical-widget">
      <div className="dashboard-card-title">Your Month in Review</div>
      {children}
    </section>
  );
}

export default MiniCalendarWidget;
