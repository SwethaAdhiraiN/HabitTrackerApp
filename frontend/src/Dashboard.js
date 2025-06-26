import React, { useEffect, useState, useCallback } from "react";
import styles from "./styles/Dashboard.module.css";
import UserHeader from "./UserHeader";
import ProgressSnapshotWidget from "./ProgressSnapshotWidget";
import MiniCalendarWidget from "./MiniCalendarWidget";
import QuoteOfTheDayWidget from "./QuoteOfTheDayWidget";

/**
 * Fetches and returns the current and longest streak info for a habit.
 * @param {number} habitId
 * @returns {object} { streak, longest, loading, error }
 */
function useHabitProgress(habitId, enabled) {
  const [progress, setProgress] = useState({ streak: 0, longest: 0 });
  const [loading, setLoading] = useState(!!enabled);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!habitId || !enabled) return;
    let cancelled = false;
    setLoading(true);
    setError(null);
    fetch(`/api/habits/${habitId}/progress`)
      .then(async (resp) => {
        if (!resp.ok) throw new Error("Could not fetch habit progress");
        const data = await resp.json();
        if (data && data.success) {
          if (!cancelled) setProgress({
            streak: data.current_streak || data.streak || 0,
            longest: data.longest_streak || 0
          });
        } else {
          if (!cancelled) setError("No progress data");
          setProgress({ streak: 0, longest: 0 });
        }
      })
      .catch((e) => {
        if (!cancelled) setError("Error loading progress");
        setProgress({ streak: 0, longest: 0 });
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, [habitId, enabled]);

  return { ...progress, loading, error };
}

// Flame SVG for streak, kept modular for possible enhancement
function FlameIcon({ color = "#F8A11E", size = 21, style = {} }) {
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", justifyContent: "center",
      width: size, height: size, marginRight: 2, ...style
    }}>
      <svg width={size} height={size} viewBox="0 0 18 18" aria-hidden="true">
        <path
          d="M9.1 3.1c.6-.7 1-1.5 1.1-2.1 1.1.9 3.1 3.1 3.8 6.2.2.9 1.5 1 2.1 1.7 1 1.2.6 4-2.2 5.7C11.2 16.4 8.2 16.7 6 15.9 2.2 14.7 0 10.9 0 8.8c0-2.1 1-2.8 2-4.2.7-1 2.5-1.6 3.2-1.6C6 3 7.4 4.3 9.1 3.1z"
          fill={color}
        />
      </svg>
    </span>
  );
}

// Modular, per-habit card renderer with streak/progress info
function HabitCard({ habit, streak, longest, streakLoading, streakError, tracker, onMarkDone, disabled = false, justTracked }) {
  // If streak info is loading, optional shimmer/placeholder; else normal
  return (
    <div className={styles.habitCard}>
      <div className={styles.habitCardTopRow}>
        {/* Icon */}
        {getIconForHabit(habit.icon)}
        {/* Name */}
        <span className={styles.habitName}>
          {habit.name || "\u2014"}
        </span>
        {/* Streak visual */}
        <span style={{ position: "relative", display: "flex", alignItems: "center", marginLeft: 8 }}>
          <FlameIcon color="#F8A11E" size={18} />
          {streakLoading ? (
            <span style={{
              minWidth: 17,
              height: 16,
              background: "#FFF2CE",
              borderRadius: 8,
              display: "inline-block",
              marginLeft: 1,
              marginRight: 2,
              opacity: 0.65,
              fontSize: "0.92rem",
              fontWeight: 600
            }} />
          ) : streakError ? (
            <span title="Could not load streak" style={{ color: "#F87A77", fontWeight: 600, fontSize: "0.97em", marginLeft: 2 }}>–</span>
          ) : (
            <span title="Current streak" style={{ color: "#F8A11E", marginLeft: 2, fontWeight: 700, fontSize: "1.03em" }}>{streak}</span>
          )}
        </span>
        {/* Longest streak in small subtext */}
        {(!streakLoading && streak >= 0 && longest > 0) && (
          <span title="Longest streak" style={{
            color: "#CF980E",
            fontWeight: 500,
            fontSize: "0.89em",
            marginLeft: 6,
            opacity: 0.72
          }}>
            🔥<span style={{ marginLeft: 2 }}>{longest}</span></span>
        )}
      </div>
      {/* 7 day checkmark tracker + optional annotation */}
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        {tracker}
      </div>
      {/* Mark as Done Today Button */}
      <MarkDoneButton
        habit={habit}
        disabled={disabled}
        onClick={onMarkDone}
        justTracked={justTracked}
      />
    </div>
  );
}

/**
 * PUBLIC_INTERFACE
 * Dashboard page container for HabitTrackerApp.
 *
 * - Fetches and displays all habits for the current user.
 * - For each habit, fetches streak/progress info from `/api/habits/:id/progress`.
 * - Annotates each habit's tracker visually with current and longest streak (flame icon, numbers, etc).
 * - Handles loading and error states at both list and per-habit streak level.
 * - Code is modular: tracker, streak icon, card, and fetch logic are split for further enhancements.
 * - Horizontal habit cards scroll, 7-day check icons, mark-done button per habit.
 * - Uses pastel palette and dashboard CSS module.
 */
function Dashboard() {
  const [user, setUser] = useState(null); // {id, ...}
  const [habits, setHabits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errMsg, setErrMsg] = useState("");
  const [trackLoading, setTrackLoading] = useState({});
  const [justTracked, setJustTracked] = useState({}); // {habitId: true}

  // Get user from storage (matches UserHeader logic)
  useEffect(() => {
    let storedUser = null;
    try {
      storedUser = JSON.parse(
        sessionStorage.getItem("habit_user") ||
          localStorage.getItem("habit_user") ||
          "null"
      );
    } catch {}
    setUser(storedUser);

    if (!storedUser || !storedUser.id) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setErrMsg("");
    // fetch habits for user_id
    fetch(`/api/habits?user_id=${storedUser.id}`)
      .then(async (resp) => {
        if (!resp.ok) throw new Error("Could not fetch habits");
        const data = await resp.json();
        if (data && data.success) setHabits(data.habits || []);
        else setErrMsg("Error loading habits");
      })
      .catch(() => setErrMsg("Could not load habits from server."))
      .finally(() => setLoading(false));
  }, []);

  // Mark habit as done for today
  const markDoneToday = useCallback(
    (habitId) => {
      if (!user?.id || !habitId) return;
      setTrackLoading((prev) => ({ ...prev, [habitId]: true }));
      setErrMsg("");
      setJustTracked((prev) => ({ ...prev, [habitId]: false }));

      // POST progress marking this habit as done today
      const today = new Date().toISOString().split("T")[0];
      fetch(`/api/progress?user_id=${user.id}&date=${today}`)
        .then(async (resp) => {
          if (!resp.ok) throw new Error("Could not fetch progress");
          const data = await resp.json();
          let habit_checkmarks = {};
          if (
            data &&
            data.success &&
            Array.isArray(data.progress) &&
            data.progress.length > 0
          ) {
            habit_checkmarks = { ...data.progress[0].habit_checkmarks };
          }
          habit_checkmarks[habitId] = true;
          return fetch("/api/progress", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              user_id: user.id,
              date: today,
              habit_checkmarks,
            }),
          });
        })
        .then(async (resp) => {
          if (!resp.ok) throw new Error("Failed to save progress");
          const result = await resp.json();
          if (!result.success) throw new Error(result.message || "Track error");
          setJustTracked((prev) => ({ ...prev, [habitId]: true }));
          // After marking as done, refetch habits to refresh UI
          fetch(`/api/habits?user_id=${user.id}`)
            .then((resp) => resp.json())
            .then((habitData) => {
              if (habitData && habitData.success) setHabits(habitData.habits || []);
            });
        })
        .catch((err) => {
          setErrMsg("Failed to mark as done: " + (err.message || ""));
        })
        .finally(() => {
          setTrackLoading((prev) => ({ ...prev, [habitId]: false }));
        });
    },
    [user]
  );

  function getIconForHabit(iconName) {
    const iconBgMap = {
      water_drop: "var(--blue-pastel, #D1EAFD)",
      lotus: "var(--purple-pastel, #E1DDFC)",
      book: "var(--purple-pastel, #E1DDFC)",
      heartbeat: "var(--coral-pastel, #FFD7DD)",
      walk: "var(--blue-pastel, #D1EAFD)",
      journal: "var(--coral-pastel, #FFD7DD)",
      default: "var(--ht-surface,#EBD6FB)",
    };
    if (iconName === "water_drop") {
      return (
        <span
          style={{
            width: 43,
            height: 43,
            borderRadius: "50%",
            background: iconBgMap.water_drop,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <svg width="26" height="26" viewBox="0 0 22 22" fill="#53A9F5">
            <path d="M10.1 3.3c-.2.1-4.6 5.1-5.5 8.1-.7 2.1-.4 4.9 2.3 6a5.3 5.3 0 005.6-1c2-1.7 2.4-4 1.7-6.2-.8-2.8-4-7-4-7zm.2 12.4c-2.4 0-4-1.7-3.8-4.1l.1-.5.8.6c.6.5 1.6.7 2.4.7s1.8-.3 2.4-.7l.8-.6.1.5c.2 2.4-1.4 4.1-3.8 4.1z" />
          </svg>
        </span>
      );
    } else if (iconName === "book") {
      return (
        <span
          style={{
            width: 43,
            height: 43,
            borderRadius: "50%",
            background: iconBgMap.book,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <svg width="26" height="26" viewBox="0 0 22 22" fill="#C48DDC">
            <path d="M3 4.5C3 3.7 3.7 3 4.5 3h6c.8 0 1.5.7 1.5 1.5v11c0 .3-.2.5-.5.5s-.5-.2-.5-.5V4.5c0-.3-.2-.5-.5-.5h-6C3.2 4 3 4.2 3 4.5V16c0 .3.2.5.5.5s.5-.2.5-.5V4.5zm13 0c0-.8-.7-1.5-1.5-1.5h-2c-.3 0-.5.2-.5.5s.2.5.5.5h2c.3 0 .5.2.5.5v12c0 .3-.2.5-.5.5h-2c-.3 0-.5.2-.5.5s.2.5.5.5h2c.8 0 1.5-.7 1.5-1.5V4.5z" />
          </svg>
        </span>
      );
    } else if (iconName === "lotus") {
      return (
        <span
          style={{
            width: 43,
            height: 43,
            borderRadius: "50%",
            background: iconBgMap.lotus,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <svg width="26" height="26" viewBox="0 0 22 22" fill="#B485C7">
            <path d="M10 17s-5.7-2.8-7.2-6C1 7.7 3.5 5 6.1 5c1.3 0 2.5.7 3.2 1.8C10.4 5.7 11.6 5 12.9 5c2.6 0 5.1 2.7 3.3 6C15.7 14.2 10 17 10 17z"/>
          </svg>
        </span>
      );
    } else if (iconName === "heartbeat") {
      return (
        <span
          style={{
            width: 43,
            height: 43,
            borderRadius: "50%",
            background: iconBgMap.heartbeat,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <svg width="26" height="26" viewBox="0 0 22 22" fill="#F87A77">
            <path d="M11 17.2l-1.47-1.32C5.4 12.36 2 9.28 2 6.5 2 4.5 3.5 3 5.5 3c1.54 0 2.54 1.08 3.04 2.09h1.92C13.96 4.08 14.96 3 16.5 3 18.5 3 20 4.5 20 6.5c0 2.78-3.4 5.86-7.53 9.38L11 17.2z"/>
          </svg>
        </span>
      );
    }
    return (
      <span
        style={{
          width: 43,
          height: 43,
          borderRadius: "50%",
          background: iconBgMap.default,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <svg width="22" height="22" viewBox="0 0 20 20" fill="#687FE5">
          <circle cx="10" cy="10" r="10" />
        </svg>
      </span>
    );
  }

  // 7-day tracker UI
  function renderTracker(daysArr = []) {
    const todayIdx = new Date().getDay();
    return (
      <div className={styles.habitDays}>
        {Array(7)
          .fill(0)
          .map((_, i) => {
            const isChecked = !!daysArr[i];
            return isChecked ? (
              <span className={styles.checkCircleChecked} key={i} title="Completed">
                <svg width="23" height="23" viewBox="0 0 20 20">
                  <circle cx="10" cy="10" r="10" fill="var(--accent-green, #54CB73)" />
                  <polyline points="6,11 9,14 14,7.5" fill="none" stroke="#fff" strokeWidth="2.3" strokeLinecap="round" />
                </svg>
              </span>
            ) : (
              <span
                className={styles.checkCircleEmpty}
                key={i}
                title={
                  i === todayIdx
                    ? "Today's habit (not yet completed)"
                    : "Incomplete"
                }
                style={
                  i === todayIdx
                    ? { border: "2px dashed #D6C7EE" }
                    : undefined
                }
              ></span>
            );
          })}
      </div>
    );
  }

  // Modularized Mark Done Button now supports justTracked status for UI clarity
  function MarkDoneButton({ habit, disabled, onClick, justTracked }) {
    const todayIdx = new Date().getDay();
    const isDoneToday =
      Array.isArray(habit.days) &&
      habit.days.length === 7 &&
      !!habit.days[todayIdx];
    return (
      <button
        type="button"
        className={styles.logoutButton}
        style={{
          marginTop: 18,
          background: isDoneToday ? "#e1ddfc" : "var(--accent-green, #54CB73)",
          color: isDoneToday ? "#8B7BC9" : "#fff",
          fontWeight: 700,
          borderRadius: 16,
          minWidth: 100,
          opacity: disabled || isDoneToday ? 0.62 : 1,
          cursor: disabled || isDoneToday ? "not-allowed" : "pointer",
          boxShadow: "0 2px 8px rgba(104,127,229,0.10)",
          border: "none",
          fontSize: "1.08em",
          padding: "11px 0",
          transition: "background .15s"
        }}
        aria-disabled={disabled || isDoneToday}
        disabled={disabled || isDoneToday}
        onClick={() => !disabled && !isDoneToday && onClick(habit.id)}
      >
        {isDoneToday
          ? "Done for Today"
          : disabled
          ? "Saving..."
          : justTracked[habit.id]
          ? "Marked!"
          : "Mark as Done Today"}
      </button>
    );
  }

  // --- Main render ---
  return (
    <div className={styles.dashboardBg}>
      {/* User Header Section (handles user info, welcome, date, logout) */}
      <UserHeader onLogout={() => window.location.reload()} />

      {/* Main Flex Content */}
      <main className={styles.mainWrapper}>
        {/* Left Main Section (habits) */}
        <section className={styles.habitSection}>
          <div className={styles.sectionTitle}>Your Habits This Week</div>
          <div
            className={styles.habitCardRow}
            aria-label="Habit cards row"
            tabIndex={-1}
          >
            {loading ? (
              Array(3)
                .fill(0)
                .map((_, i) => (
                  <div
                    key={i}
                    className={styles.habitCard}
                    style={{
                      opacity: 0.44,
                      minHeight: 120,
                      minWidth: 290,
                      background: "#faf5fd",
                      border: "2px dashed #E1DDFC",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontStyle: "italic"
                    }}
                  >
                    Loading...
                  </div>
                ))
            ) : errMsg ? (
              <div className={styles.habitCard} style={{ color: "#F87A77", fontWeight: 600 }}>
                {errMsg}
              </div>
            ) : habits.length === 0 ? (
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
                No habits to display. Add a habit to get started!
              </div>
            ) : (
              habits.map(habit => {
                // for each habit load streak/progress info
                const { streak, longest, loading: streakLoading, error: streakError }
                  = useHabitProgress(habit.id, true);
                return (
                  <HabitCard
                    key={habit.id}
                    habit={habit}
                    streak={streak}
                    longest={longest}
                    streakLoading={streakLoading}
                    streakError={streakError}
                    tracker={renderTracker(habit.days)}
                    onMarkDone={markDoneToday}
                    disabled={!!trackLoading[habit.id]}
                    justTracked={justTracked}
                  />
                );
              })
            )}
          </div>
        </section>

        {/* Sidebar */}
        <aside className={styles.sidebar}>
          {/* Progress Snapshot widget card (implements progress snapshot) */}
          <ProgressSnapshotWidget userId={user?.id} />
          {/* Quote of the Day Widget */}
          <QuoteOfTheDayWidget />
          {/* Mini Calendar */}
          <MiniCalendarWidget userId={user?.id} />
        </aside>
      </main>
    </div>
  );
}

export default Dashboard;
