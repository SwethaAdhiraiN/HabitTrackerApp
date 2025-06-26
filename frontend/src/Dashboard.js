import React, { useEffect, useState } from "react";
import styles from "./styles/Dashboard.module.css";

/**
 * PUBLIC_INTERFACE
 * Dashboard page container for HabitTrackerApp.
 *
 * - Large, pastel, modern layout for desktop view (matches dashboard_design_notes.md and wireframe).
 * - Enforces pastel peach (#FCD8CD) background, soft cards, and wireframe arrangement, no static/demo habit data.
 * - Loads (future) user data or children widgets, remains non-interactive shell for now.
 * - Sidebar zone ready for widgets: Progress Snapshot, Quote, Mini Calendar.
 * - Responsive design for desktop.
 */
function Dashboard() {
  // Placeholder for user data, to be replaced when user context/auth is integrated
  const [user, setUser] = useState(null);

  // Fetch user info (future integration: currently, mimic login success, use fallback)
  useEffect(() => {
    // Optionally, user info could be read from a context/auth provider or via API
    // setUser({...}) or navigate("/login") if not logged in
    // For now, we'll keep this as a placeholder with a sample name
    setUser({
      name: "Your Name",
      avatar: "", // Set to avatar URL from backend if available
      email: "",
    });
  }, []);

  // Get readable date
  function prettyToday() {
    const today = new Date();
    return today.toLocaleDateString(undefined, {
      weekday: "long",
      month: "long",
      day: "numeric",
    });
  }

  return (
    <div className={styles.dashboardBg}>
      {/* Header Section */}
      <header className={styles.header}>
        <div className={styles.logo} aria-label="HabitTrackerApp Logo" tabIndex={0}>
          HabitTracker
        </div>
        <div className={styles.greetingsZone}>
          <div className={styles.greeting}>
            Good morning,
            <span className={styles.name} style={{ marginLeft: 8 }}>
              {user ? user.name : "Friend"}
            </span>
            !
          </div>
          <div className={styles.date}>
            Today is {prettyToday()}
          </div>
        </div>
        <div className={styles.avatar}>
          {/* Could show actual avatar here */}
          <span className={styles.avatarImg}>
            {user && user.avatar
              ? <img src={user.avatar} alt="User avatar" style={{ width: "100%", borderRadius: "50%" }} />
              : <svg width="32" height="32" viewBox="0 0 32 32" fill="#EBD6FB"><circle cx="16" cy="16" r="16" /><text x="50%" y="56%" textAnchor="middle" fontWeight={700} fontSize="15" fill="#687FE5" dy=".3em">{user && user.name ? user.name[0].toUpperCase() : "U"}</text></svg>
            }
          </span>
          {user && user.email && (
            <span className={styles.avatarEmail}>{user.email}</span>
          )}
        </div>
      </header>

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
                      // Show today, otherwise _
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
