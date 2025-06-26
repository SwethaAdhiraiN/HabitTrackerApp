import React from "react";
import styles from "./styles/Dashboard.module.css";
import UserHeader from "./UserHeader";

/**
 * PUBLIC_INTERFACE
 * Dashboard page container for HabitTrackerApp.
 *
 * Uses <UserHeader /> to display authenticated user info and logout, styled with the app's pastel palette.
 * Main area: habit tracking and widgets (Progress, Quote, Calendar), ready for further extension.
 */
function Dashboard() {
  // Logout callback handled in header, can add more logic here if needed
  function handleLogout() {
    // Logic may be added here if necessary in the future
  }

  return (
    <div className={styles.dashboardBg}>
      {/* User Header Section (handles user info, welcome, date, logout) */}
      <UserHeader onLogout={handleLogout} />

      {/* Main Flex Content */}
      <main className={styles.mainWrapper}>
        {/* Left Main Section (habits) */}
        <section className={styles.habitSection}>
          <div className={styles.sectionTitle}>
            Your Habits This Week
          </div>
          {/* Placeholder: This is where the Horizontal habit card row will go */}
          <div className={styles.habitCardRow} aria-label="Habit cards row" tabIndex={-1}>
            {/* No demo/static data—this will populate with actual user habits via API/props */}
            {/* Example skeleton content for now */}
            <div
              className={styles.habitCard}
              aria-label="No habits found. Add a habit to get started!"
              style={{
                opacity: 0.55,
                cursor: "not-allowed",
                minHeight: 110,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                fontSize: "1.32rem",
                color: "var(--ht-secondary-text, #7A7F92)",
                fontStyle: "italic",
              }}
            >
              {/* TODO: Replace with actual habits after integration */}
              No habits to display. (Connect to service)
            </div>
          </div>
          {/* (Below: Tracker Table or additional widgets to be slotted in by child components) */}
        </section>

        {/* Sidebar */}
        <aside className={styles.sidebar}>
          {/* Progress Snapshot widget card (empty for now) */}
          <div className={styles.widget} aria-label="Progress snapshot">
            <div className={styles.widgetLabel}>Progress Snapshot</div>
            <div className={styles.progressList}>
              {/* No demo/static value, leave zone for widget */}
              <span
                className={styles.progressStat}
                style={{ color: "var(--ht-secondary-text)", fontSize: "1rem", fontStyle: "italic" }}
              >
                Progress stats will show here.
              </span>
            </div>
          </div>
          {/* Quote of the Day */}
          <div className={styles.widget} aria-label="Quote of the Day">
            <div className={styles.widgetLabel}>Quote of the Day</div>
            <div className={styles.quoteText}>
              {/* Real quote will be injected via future API call */}
              <span style={{ color: "var(--ht-primary)", fontStyle: "italic" }}>
                {"Stay motivated! Your quote will appear here."}
              </span>
            </div>
            <div className={styles.quoteAuthor} style={{ marginTop: 4 }}>
              — HabitTrackerApp
            </div>
          </div>
          {/* Mini Calendar */}
          <div className={styles.calendarWidget} aria-label="Mini Calendar">
            <div className={styles.calendarHeader}>Monthly Calendar</div>
            <div className={styles.calendarDaysRow}>
              {/* Example: Weekdays */}
              {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
                <div key={d} className={styles.calendarDay}>
                  <div className={styles.dayLabel}>{d}</div>
                  <div
                    className={
                      new Date().getDay() === i
                        ? styles.dayCircle + " " + styles.calendarToday
                        : styles.dayCircle
                    }
                  >
                    {/* Render day number of week for current month as placeholder */}
                    {(() => {
                      // Show today, otherwise –
                      const today = new Date();
                      return today.getDay() === i ? today.getDate() : "–";
                    })()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </main>
    </div>
  );
}

export default Dashboard;
