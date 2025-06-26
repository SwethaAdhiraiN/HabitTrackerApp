import React, { useEffect, useState, useCallback } from "react";
import styles from "./styles/Dashboard.module.css";
import UserHeader from "./UserHeader";

/**
 * PUBLIC_INTERFACE
 * Dashboard page container for HabitTrackerApp.
 *
 * - Fetches and displays all habits for the current user.
 * - Lists them in a horizontal scrollable card UI ("Your Habits This Week").
 * - Shows a 7-day progress tracker for each habit, check/ice icon for completion.
 * - Provides a "Mark as Done Today" button, updating habit via POST to /api/habits/:id/track.
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

  // Button: mark as done today
  function MarkDoneButton({ habit, disabled, onClick }) {
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

  // Streak UI: flame/star with number
  function StreakIndicator({ count = 0 }) {
    if (!count || count < 1) return null;
    return (
      <span className={styles.streakIcon} title="Current streak">
        <svg width="19" height="19" viewBox="0 0 16 16">
          <path
            d="M8 1l2 4 5 .7-3.7 3.7.9 5-4.2-2.4L4 14l1-5L1.2 5.7 6 5l2-4z"
            fill="#F8A11E"
            stroke="#E19B07"
            strokeWidth="0.8"
          />
        </svg>
        <span className={styles.streakCount}>{count}</span>
      </span>
    );
  }

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
              habits.map((habit) => (
                <div className={styles.habitCard} key={habit.id}>
                  <div className={styles.habitCardTopRow}>
                    {/* Icon */}
                    {getIconForHabit(habit.icon)}
                    {/* Name */}
                    <span className={styles.habitName}>
                      {habit.name || "—"}
                    </span>
                    {/* Streak */}
                    <StreakIndicator count={habit.streak} />
                  </div>
                  {/* 7 day checkmark tracker */}
                  {renderTracker(habit.days)}
                  {/* Mark as Done Today Button */}
                  <MarkDoneButton
                    habit={habit}
                    disabled={!!trackLoading[habit.id]}
                    onClick={markDoneToday}
                  />
                </div>
              ))
            )}
          </div>
        </section>

        {/* Sidebar */}
        <aside className={styles.sidebar}>
          {/* Progress Snapshot widget card (empty for now) */}
          <div className={styles.widget} aria-label="Progress snapshot">
            <div className={styles.widgetLabel}>Progress Snapshot</div>
            <div className={styles.progressList}>
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
                    {(() => {
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
