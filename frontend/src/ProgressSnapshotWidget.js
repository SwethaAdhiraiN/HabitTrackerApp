import React, { useEffect, useState } from "react";
import styles from "./styles/Dashboard.module.css";

/**
 * PUBLIC_INTERFACE
 * ProgressSnapshotWidget — Shows user's habit progress summary in the Dashboard sidebar.
 * - Fetches /api/progress and /api/habits (user scoped).
 * - Calculates: total habits, habits completed today, longest streak, current streak, weekly completion %.
 * - Handles loading, error, and empty UI states.
 * - Style: Pastel card with large numbers, label/value styling, matches Dashboard.module.css.
 *
 * Usage:
 *   <ProgressSnapshotWidget userId={1} />
 */
function ProgressSnapshotWidget({ userId }) {
  const [loading, setLoading] = useState(true);
  const [errMsg, setErrMsg] = useState("");
  const [metrics, setMetrics] = useState(null);

  useEffect(() => {
    let cancelled = false;
    if (!userId) {
      setMetrics(null);
      setLoading(false);
      setErrMsg("No user");
      return;
    }
    setLoading(true);
    setErrMsg("");
    setMetrics(null);

    // Load both habits and progress for metric calculation
    Promise.all([
      fetch(`/api/habits?user_id=${userId}`).then(resp => resp.ok ? resp.json() : Promise.reject("Error loading habits")),
      fetch(`/api/progress?user_id=${userId}`).then(resp => resp.ok ? resp.json() : Promise.reject("Error loading progress")),
    ])
      .then(([habRes, progRes]) => {
        if (!habRes.success || !Array.isArray(habRes.habits)) throw new Error("No habits data");
        if (!progRes.success || !Array.isArray(progRes.progress)) throw new Error("No progress data");

        const habits = habRes.habits || [];
        const totalHabits = habits.length;
        if (totalHabits === 0) {
          setMetrics({ totalHabits: 0, completedToday: 0, longestStreak: 0, currentStreak: 0, weeklyPct: 0 });
          return;
        }
        // --- Find today's progress snapshot
        const todayStr = new Date().toISOString().split("T")[0];
        const weekDays = getPastDates(6); // Last 7 days, including today
        // Find or build per-day progress
        const weekProgress = weekDays.map(date => progRes.progress.find(p => p.date === date) || null);

        // Completed today
        const todayProg = progRes.progress.find(p => p.date === todayStr);
        const completedToday = todayProg ? todayProg.total_checked || 0 : 0;

        // Longest and current streak calculation (any habit checked per day = day complete)
        // We'll use weekDays + as much of the user's progress as needed

        // For current streak: count consecutive days up to today (going backwards) with all habits done
        // For longest: find the max such streak in progress
        const streakArr = progRes.progress
          .map(p => ({ d: p.date, done: (p.total_checked >= p.total_habits && p.total_habits > 0) }))
          .sort((a, b) => a.d.localeCompare(b.d)); // ascending order

        let currentStreak = 0, longestStreak = 0;
        // Map progress by date for fast lookup
        const progByDate = {};
        for (let p of streakArr) progByDate[p.d] = p;
        // Search for the longest streak
        let cur = 0;
        let lastDate = null;
        for (let i = 0; i < streakArr.length; ++i) {
          const { d, done } = streakArr[i];
          if (!done) {
            longestStreak = Math.max(longestStreak, cur);
            cur = 0;
          } else if (!lastDate || isNextDay(lastDate, d)) {
            cur += 1;
          } else {
            longestStreak = Math.max(longestStreak, cur);
            cur = 1;
          }
          lastDate = d;
        }
        longestStreak = Math.max(longestStreak, cur);

        // Current streak (count backward from today)
        let cstreak = 0;
        let ptrDate = todayStr;
        // go back day by day
        while (progByDate[ptrDate] && progByDate[ptrDate].done) {
          cstreak += 1;
          ptrDate = dateMinusDays(ptrDate, 1);
        }

        // Weekly completion %
        let totalHabitsWeek = 0, totalCheckedWeek = 0, countedDays = 0;
        for (let wd of weekDays) {
          const prog = progRes.progress.find(p => p.date === wd);
          if (prog && prog.total_habits > 0) {
            totalHabitsWeek += prog.total_habits;
            totalCheckedWeek += prog.total_checked;
            countedDays += 1;
          }
        }
        const weeklyPct = (totalHabitsWeek > 0)
          ? Math.round((totalCheckedWeek / totalHabitsWeek) * 100)
          : 0;

        if (!cancelled) {
          setMetrics({
            totalHabits,
            completedToday,
            longestStreak,
            currentStreak: cstreak,
            weeklyPct,
          });
        }
      })
      .catch(err => {
        if (!cancelled) {
          setErrMsg("Could not load progress.");
          setMetrics(null);
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, [userId]);

  // Helper: an array of last n days (inclusive), newest first
  function getPastDates(n) {
    const arr = [];
    const dt = new Date();
    for (let i = n; i >= 0; --i) {
      const d = new Date(dt);
      d.setDate(dt.getDate() - i);
      arr.push(d.toISOString().split("T")[0]);
    }
    return arr;
  }
  // Helper: is date2 next after date1 (yyyy-mm-dd, next calendar day)
  function isNextDay(date1, date2) {
    const d1 = new Date(date1), d2 = new Date(date2);
    const next = new Date(d1);
    next.setDate(d1.getDate() + 1);
    return d2.toISOString().split("T")[0] === next.toISOString().split("T")[0];
  }
  // Helper: date string minus days
  function dateMinusDays(dateStr, n) {
    const d = new Date(dateStr);
    d.setDate(d.getDate() - n);
    return d.toISOString().split("T")[0];
  }

  // --- Render: loading, error, empty, or metrics
  return (
    <div className={styles.widget} aria-label="Progress snapshot">
      <div className={styles.widgetLabel}>Progress Snapshot</div>
      <div className={styles.progressList}>
        {loading ? (
          <>
            {Array(5)
              .fill(0)
              .map((_, i) => (
                <div className={styles.progressStat} key={i} style={{ opacity: 0.46, background: "#FEEBF6", borderRadius: 14, minHeight: 18, minWidth: 94 }} />
              ))}
          </>
        ) : errMsg ? (
          <span className={styles.progressStat} style={{ color: "var(--ht-error,#F87A77)", fontWeight: 600 }}>{errMsg}</span>
        ) : !metrics ? (
          <span className={styles.progressStat} style={{ color: "var(--ht-secondary-text)", fontStyle: "italic" }}>
            Stats unavailable.
          </span>
        ) : metrics.totalHabits === 0 ? (
          <span className={styles.progressStat} style={{ color: "var(--ht-secondary-text)", fontStyle: "italic" }}>
            No habits found. Add a habit to get started!
          </span>
        ) : (
          <>
            <div className={styles.progressStat}>
              <span className={styles.progressLabel}>Total Habits</span>
              <span className={styles.progressValue} aria-label="Total habits">{metrics.totalHabits}</span>
            </div>
            <div className={styles.progressStat}>
              <span className={styles.progressLabel}>Completed Today</span>
              <span className={styles.progressValue} aria-label="Completed Today">{metrics.completedToday}</span>
            </div>
            <div className={styles.progressStat}>
              <span className={styles.progressLabel}>Current Streak</span>
              <span className={styles.progressValue} aria-label="Current streak" style={{ color: "#F8A11E" }}>
                {metrics.currentStreak}
              </span>
            </div>
            <div className={styles.progressStat}>
              <span className={styles.progressLabel}>Longest Streak</span>
              <span className={styles.progressValue} aria-label="Longest streak" style={{ color: "#CF980E" }}>
                {metrics.longestStreak}
              </span>
            </div>
            <div className={styles.progressStat}>
              <span className={styles.progressLabel}>Weekly Completion</span>
              <span className={styles.progressValue} aria-label="Weekly % complete" style={{ color: "var(--ht-primary)" }}>
                {metrics.weeklyPct}%
              </span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default ProgressSnapshotWidget;
