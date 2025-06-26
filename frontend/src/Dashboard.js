import React from "react";
import { Link } from "react-router-dom";
import MiniCalendarWidget from "./MiniCalendarWidget";
import ProgressSnapshotWidget from "./ProgressSnapshotWidget";
import QuoteOfTheDayWidget from "./QuoteOfTheDayWidget";
import UserHeader from "./UserHeader";
import styles from "./styles/Dashboard.module.css";

/**
 * PUBLIC_INTERFACE
 * Dashboard page main content for logged-in users.
 * Renders shortcut nav links to dashboard destinations, and major dashboard widgets.
 */
function Dashboard() {
  return (
    <div className={styles.dashboardContainer}>
      <UserHeader />

      {/* Navigation Shortcuts - Harmonious Pastel Buttons Section */}
      <nav
        className={styles.dashboardShortcutsNav}
        style={{
          display: "flex",
          flexDirection: "row",
          gap: 16,
          justifyContent: "center",
          alignItems: "center",
          margin: "32px 0 24px 0",
        }}
        aria-label="Dashboard navigation shortcuts"
      >
        <Link
          to="/dashboard/new-habit"
          className={styles.dashboardShortcutBtn}
          style={{
            background: "linear-gradient(120deg, #D1E9FA 70%, #ECCCF7 100%)",
            color: "#35295D",
            border: "none",
            borderRadius: 14,
            padding: "12px 19px",
            fontWeight: 600,
            fontSize: "1.07rem",
            letterSpacing: "0.01em",
            boxShadow: "0 2px 8px rgba(123,97,255,0.10)",
            transition: "transform 0.12s, box-shadow 0.15s",
            textDecoration: "none",
            outline: "none",
            cursor: "pointer",
          }}
        >
          + Create New Habit
        </Link>

        <Link
          to="/dashboard/habits"
          className={styles.dashboardShortcutBtn}
          style={{
            background: "linear-gradient(120deg, #E8E5FC 70%, #F9E9F0 100%)",
            color: "#483372",
            border: "none",
            borderRadius: 14,
            padding: "12px 19px",
            fontWeight: 600,
            fontSize: "1.07rem",
            letterSpacing: "0.01em",
            boxShadow: "0 2px 8px rgba(104,127,229,0.09)",
            transition: "transform 0.12s, box-shadow 0.15s",
            textDecoration: "none",
            outline: "none",
            cursor: "pointer",
          }}
        >
          View Habits List
        </Link>

        <Link
          to="/dashboard/progress"
          className={styles.dashboardShortcutBtn}
          style={{
            background: "linear-gradient(120deg, #FBEFF3 70%, #FDECED 100%)",
            color: "#7C335C",
            border: "none",
            borderRadius: 14,
            padding: "12px 19px",
            fontWeight: 600,
            fontSize: "1.07rem",
            letterSpacing: "0.01em",
            boxShadow: "0 2px 8px rgba(247,161,178,0.08)",
            transition: "transform 0.12s, box-shadow 0.15s",
            textDecoration: "none",
            outline: "none",
            cursor: "pointer",
          }}
        >
          Track Progress
        </Link>

        <Link
          to="/dashboard/profile"
          className={styles.dashboardShortcutBtn}
          style={{
            background: "linear-gradient(120deg, #EBFAE6 70%, #D2E7FB 100%)",
            color: "#27785D",
            border: "none",
            borderRadius: 14,
            padding: "12px 19px",
            fontWeight: 600,
            fontSize: "1.07rem",
            letterSpacing: "0.01em",
            boxShadow: "0 2px 8px rgba(71,219,127,0.08)",
            transition: "transform 0.12s, box-shadow 0.15s",
            textDecoration: "none",
            outline: "none",
            cursor: "pointer",
          }}
        >
          Profile
        </Link>

        <Link
          to="/dashboard/settings"
          className={styles.dashboardShortcutBtn}
          style={{
            background: "linear-gradient(120deg, #FDF5E6 70%, #E3F3FA 100%)",
            color: "#AA5A27",
            border: "none",
            borderRadius: 14,
            padding: "12px 19px",
            fontWeight: 600,
            fontSize: "1.07rem",
            letterSpacing: "0.01em",
            boxShadow: "0 2px 8px rgba(255,211,134,0.07)",
            transition: "transform 0.12s, box-shadow 0.15s",
            textDecoration: "none",
            outline: "none",
            cursor: "pointer",
          }}
        >
          Settings
        </Link>
      </nav>

      {/* Widgets and content */}
      <div className={styles.widgetsRow}>
        <MiniCalendarWidget />
        <ProgressSnapshotWidget />
        <QuoteOfTheDayWidget />
      </div>
    </div>
  );
}

export default Dashboard;
