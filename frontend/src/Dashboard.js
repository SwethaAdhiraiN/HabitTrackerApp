import React from "react";
import styles from "./styles/Dashboard.module.css";

/**
 * PUBLIC_INTERFACE
 * Dashboard page for HabitTrackerApp (OLD VERSION - BEFORE REDESIGN)
 * This component renders the dashboard with the previous simple layout,
 * restoring the structure and style prior to the visual overhaul.
 */
const Dashboard = () => {
  return (
    <div className={styles.dashboardContainer}>
      <header className={styles.header}>
        <h2>Dashboard</h2>
      </header>
      <main className={styles.mainContent}>
        <section className={styles.section}>
          <h3>Welcome back!</h3>
          <p>
            Track your habits here.<br />
            Use the navigation to add or view your progress.
          </p>
        </section>

        <section className={styles.section}>
          <h4>Your Stats</h4>
          <div className={styles.statsGrid}>
            <div className={styles.statCard}>
              <span className={styles.statNumber}>3</span>
              <span className={styles.statLabel}>Habits</span>
            </div>
            <div className={styles.statCard}>
              <span className={styles.statNumber}>15</span>
              <span className={styles.statLabel}>Days Streak</span>
            </div>
            <div className={styles.statCard}>
              <span className={styles.statNumber}>85%</span>
              <span className={styles.statLabel}>Success Rate</span>
            </div>
          </div>
        </section>

        <section className={styles.section}>
          <h4>Recent Activity</h4>
          <ol className={styles.recentList}>
            <li>✓ Drank Water (Today)</li>
            <li>✓ Read Book (Yesterday)</li>
            <li>✓ Meditated (Yesterday)</li>
            <li>✗ Go for Walk (2 days ago)</li>
          </ol>
        </section>
      </main>
    </div>
  );
};

export default Dashboard;
