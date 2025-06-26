import React, { useEffect, useMemo, useState } from "react";
import styles from "./styles/Dashboard.module.css";

/**
 * PUBLIC_INTERFACE
 * Dashboard component for HabitTrackerApp (desktop-optimized).
 * - Fetches user, habits, progress, and quote data asynchronously from JSON files in /database.
 * - Handles loading and error states, replacing all static/demo values.
 * - Top header with user name/greeting/date, dynamic UI reflecting mock data from simulated API calls.
 */
function Dashboard() {
  // Loading and error states
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Data states
  const [users, setUsers] = useState([]);
  const [habits, setHabits] = useState([]);
  const [progress, setProgress] = useState([]);
  const [quotes, setQuotes] = useState([]);

  // Pick the first user as the "logged in" demo user
  const [user, setUser] = useState(null);
  // Determine user's habits and progress dynamically
  const [userHabits, setUserHabits] = useState([]);
  const [userProgress, setUserProgress] = useState(null);

  // Random quote for the day
  const [quoteOfDay, setQuoteOfDay] = useState(null);

  // Fetch data from backend API endpoints
  useEffect(() => {
    let ignore = false;
    setLoading(true);

    // Simulate user id = 1 for demo
    const userId = 1;

    // Parallel fetch for API responses
    Promise.all([
      fetch(`/api/user/${userId}`).then(async r => {
        if (!r.ok) throw new Error("User not found");
        const data = await r.json();
        return data.user;
      }),
      fetch(`/api/habits?user_id=${userId}`).then(async r => {
        if (!r.ok) throw new Error("Habits fetch failed");
        const data = await r.json();
        return data.habits;
      }),
      fetch(`/api/progress?user_id=${userId}`).then(async r => {
        if (!r.ok) throw new Error("Progress fetch failed");
        const data = await r.json();
        return data.progress;
      }),
      fetch(`/api/quote`).then(async r => {
        if (!r.ok) throw new Error("Quote fetch failed");
        const data = await r.json();
        return data.quote;
      }),
    ])
      .then(([userData, habitsData, progressData, quoteData]) => {
        if (ignore) return;
        setUser(userData);
        setUsers([userData]);
        setHabits(habitsData);
        setUserHabits(habitsData);

        // Show most recent progress for the user
        if (progressData && progressData.length > 0) {
          // Find today or latest
          const todayStr = new Date().toISOString().slice(0, 10);
          let uProgress =
            progressData.find((p) => p.date === todayStr)
              || progressData.sort((a, b) => (a.date < b.date ? 1 : -1))[0];
          setUserProgress(uProgress);
        } else {
          setUserProgress(null);
        }
        setQuotes([quoteData]);
        setQuoteOfDay(quoteData);
        setError(null);
        setLoading(false);
      })
      .catch((err) => {
        if (ignore) return;
        setError("Failed to load data. " + (err.message || ""));
        setLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, []);

  // Today label and date, for header
  const today = useMemo(() => {
    const dateObj = new Date();
    return {
      dayLabel: dateObj.toLocaleDateString("en-US", { weekday: "long" }),
      fullDate: dateObj.toLocaleDateString("en-US", { month: "long", day: "numeric" }),
    };
  }, []);

  // Calendar week computation
  const calendarDays = useMemo(() => {
    const date = new Date();
    const todayIdx = date.getDay(); // 0 (Sun) ... 6 (Sat)
    const days = [];
    // Show full week: Sun-Sat
    for (let i = 0; i < 7; i++) {
      const d = new Date(date);
      d.setDate(date.getDate() - todayIdx + i);
      days.push({
        day: d.toLocaleString("en-US", { weekday: "short" }),
        date: d.getDate(),
        isToday: i === todayIdx,
      });
    }
    return days;
  }, []);

  // Progress snapshot calculations
  const progressStats = useMemo(() => {
    if (!userProgress || !userHabits.length) return [];
    // Compute most recent streak
    let longestStreak = 0;
    userHabits.forEach(h => {
      if (h.streak > longestStreak) longestStreak = h.streak;
    });
    // Compute checkmarks this week (sum all days: userHabits.days)
    let weekCheckmarks = userHabits.reduce((sum, h) => sum + h.days.filter(Boolean).length, 0);
    return [
      { label: "Total Habits", value: userHabits.length },
      { label: "Checkmarks This Week", value: weekCheckmarks },
      { label: "Current Longest Streak", value: longestStreak, icon: <FlameIcon /> },
    ];
  }, [userHabits, userProgress]);

  // Loading & error UI
  if (loading)
    return (
      <div className={styles.dashboardBg} style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
        <span style={{ color: "var(--ht-primary)", fontSize: "1.4rem", fontWeight: 700 }}>
          Loading your dashboard...
        </span>
      </div>
    );
  if (error)
    return (
      <div className={styles.dashboardBg} style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
        <span style={{ color: "var(--ht-error)", fontSize: "1.14rem", fontWeight: 700 }}>{error}</span>
      </div>
    );
  if (!user)
    return (
      <div className={styles.dashboardBg} style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
        <span style={{ color: "var(--ht-error)", fontSize: "1.18rem", fontWeight: 700 }}>
          No user found in demo data.
        </span>
      </div>
    );

  // Icon rendering for demo (SVG selection based on habit.icon string field)
  function IconFromString(iconStr, bgColor) {
    switch (iconStr) {
      case "water_drop":
        return (
          <HabitIcon bg={bgColor || "#EBD6FB"}>
            <svg width="27" height="27" viewBox="0 0 24 24" fill="#53A9F5">
              <path d="M12.07 3.5c-.2.1-5 5.6-6 8.8-.8 2.2-.5 5.3 2.5 6.6 2.9 1.2 6.4.5 8.1-2 .8-1.1 1.2-2.3.9-3.7-.8-3-5.2-9.1-5.5-9.7zm.1 14c-2.7 0-4.5-1.7-4.2-4.5l.1-.5.8.5a3.6 3.6 0 002.7.8c.9.1 1.8-.1 2.6-.7l.8-.6.1.5c.3 2.8-1.5 4.5-4.2 4.5z" />
            </svg>
          </HabitIcon>
        );
      case "lotus":
        return (
          <HabitIcon bg={bgColor || "#FEEBF6"}>
            <svg width="27" height="27" viewBox="0 0 24 24" fill="#F7A1B2">
              <path d="M12 3a9 9 0 00-9 9 8.98 8.98 0 008 8.93A8.98 8.98 0 0021 12a9 9 0 00-9-9zm0 16c-3.9 0-7-3.1-7-7a6.978 6.978 0 017-7v14z"/>
            </svg>
          </HabitIcon>
        );
      case "book":
        return (
          <HabitIcon bg={bgColor || "#687FE5"}>
            <svg width="27" height="27" viewBox="0 0 24 24" fill="#fff">
              <path d="M5 4a3 3 0 0 0-3 3v11a3 3 0 0 0 3 3h3V4H5zm14-1H10v17h9a3 3 0 0 0 3-3V6a3 3 0 0 0-3-3z" />
            </svg>
          </HabitIcon>
        );
      case "heartbeat":
        return (
          <HabitIcon bg={bgColor || "#FEEBF6"}>
            <svg width="27" height="27" viewBox="0 0 24 24" fill="#687FE5">
              <path d="M16.5 4.2c-1.7 0-3.4.97-4.24 2.43C11.1 5.17 9.31 4.12 7.5 4.12 4.36 4.12 2 6.8 2 10c0 3.95 6.24 8.36 9.12 9.97.56.31 1.27.31 1.83 0C15.76 18.36 22 13.98 22 10c0-3.2-2.36-5.8-5.5-5.8z"/>
            </svg>
          </HabitIcon>
        );
      case "journal":
        return (
          <HabitIcon bg={bgColor || "#EBD6FB"}>
            <svg width="27" height="27" viewBox="0 0 24 24" fill="#C48DDC">
              <rect x="4.5" y="3.5" width="15" height="17" rx="4" fill="#EBD6FB"/>
              <rect x="7" y="7" width="9" height="6" rx="2" fill="#fff"/>
            </svg>
          </HabitIcon>
        );
      case "walk":
        return (
          <HabitIcon bg={bgColor || "#687FE5"}>
            <svg width="27" height="27" viewBox="0 1 24 22" fill="#687FE5">
              <circle cx="12" cy="7" r="3" fill="#687FE5"/>
              <path d="M12 10v7M12 17c0-1 1-2 2-2h1M12 10c-2 0-3 1.5-3 3l.5 2m2.5 2v-5"/>
            </svg>
          </HabitIcon>
        );
      default:
        return (
          <HabitIcon bg={bgColor || "#EBD6FB"}>
            <svg width="27" height="27" viewBox="0 0 27 27" fill="#FEEBF6"><circle cx="13.5" cy="13.5" r="13.5" /></svg>
          </HabitIcon>
        );
    }
  }

  return (
    <div className={styles.dashboardBg}>
      {/* Header (sticky desktop style) */}
      <header className={styles.header}>
        <div className={styles.logo}>HabitTrackerApp</div>
        <div className={styles.greetingsZone}>
          <div className={styles.greeting}>
            Good Morning, <span className={styles.name}>{user.name}!</span>
          </div>
          <div className={styles.date}>
            Today is {today.dayLabel}, {today.fullDate}
          </div>
        </div>
        <div className={styles.avatar}>
          {/* Demo user's avatar or emoji */}
          {user.avatar ? (
            <img src={user.avatar} alt={user.name} className={styles.avatarImg} style={{ borderRadius: "50%", width: 38, height: 38, marginRight: 3 }} />
          ) : (
            <span role="img" aria-label="user" className={styles.avatarImg}>
              🧑‍💻
            </span>
          )}
          <span className={styles.avatarEmail}>{user.email}</span>
        </div>
      </header>
      <main className={styles.mainWrapper}>
        <section className={styles.habitSection}>
          <h1 className={styles.sectionTitle}>Your Habits This Week</h1>
          {userHabits.length === 0 ? (
            <div style={{ color: "var(--ht-error)", fontWeight: 600, fontSize: "1.1rem", padding: "12px 0" }}>
              You have no habits yet!
            </div>
          ) : (
            <div className={styles.habitCardRow}>
              {userHabits.map((habit) => (
                <HabitCard
                  key={habit.id}
                  icon={IconFromString(habit.icon)}
                  name={habit.name}
                  days={habit.days}
                  streak={habit.streak}
                />
              ))}
            </div>
          )}
        </section>
        <aside className={styles.sidebar}>
          <div className={styles.widget}>
            <div className={styles.widgetLabel}>Progress Snapshot</div>
            <div className={styles.progressList}>
              {progressStats.length === 0 ? (
                <span style={{ color: "var(--ht-secondary-text)" }}>No progress data found.</span>
              ) : (
                progressStats.map((stat, i) => (
                  <div key={i} className={styles.progressStat}>
                    <span className={styles.progressValue}>
                      {stat.icon ? stat.icon : null}
                      {stat.value}
                    </span>
                    <span className={styles.progressLabel}>{stat.label}</span>
                  </div>
                ))
              )}
            </div>
          </div>
          <div className={styles.widget}>
            <div className={styles.widgetLabel}>Quote of the Day</div>
            <blockquote className={styles.quoteBody}>
              <span className={styles.quoteText}>
                &ldquo;{quoteOfDay ? quoteOfDay.text : "No quote found."}&rdquo;
              </span>
              <span className={styles.quoteAuthor}>
                — {quoteOfDay ? quoteOfDay.author : ""}
              </span>
            </blockquote>
          </div>
          <div className={styles.widget} style={{ position: "relative", minHeight: 90 }}>
            <MiniCalendar days={calendarDays} />
          </div>
        </aside>
      </main>
    </div>
  );
}

// --- Helper Components ---

/**
 * Pastel Circle Habit Icon container.
 */
function HabitIcon({ bg, children }) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        width: 38,
        height: 38,
        borderRadius: 19,
        background: bg,
        marginRight: 16,
        boxShadow: "0 2px 7px rgba(104,127,229,0.07)",
      }}
    >
      {children}
    </span>
  );
}

/**
 * Habit Card, shows icon, name, horizontal tracker of 7 days, and current streak indicator.
 */
function HabitCard({ icon, name, days, streak }) {
  return (
    <div className={styles.habitCard}>
      <div className={styles.habitCardTopRow}>
        {icon}
        <div className={styles.habitName}>{name}</div>
        {streak > 1 ? (
          <span className={styles.streakIcon} title="Current streak">
            <FlameIcon />
            <span className={styles.streakCount}>{streak}d</span>
          </span>
        ) : null}
      </div>
      <div className={styles.habitDays}>
        {Array(7)
          .fill(0)
          .map((_, idx) => (
            <CheckCircle checked={!!days[idx]} key={idx} />
          ))}
      </div>
    </div>
  );
}

/**
 * Pastel animated check or empty circle.
 */
function CheckCircle({ checked }) {
  return checked ? (
    <span className={styles.checkCircleChecked}>
      {/* Check SVG */}
      <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
        <circle cx="7.5" cy="7.5" r="7.5" fill="#67d88a" />
        <path d="M5 8.2l2 2 3-3" stroke="#FFF" strokeWidth="1.7" strokeLinecap="round" />
      </svg>
    </span>
  ) : (
    <span className={styles.checkCircleEmpty}>
      <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
        <circle
          cx="7.5"
          cy="7.5"
          r="7"
          stroke="#B0B0C3"
          strokeWidth="1.2"
          fill="#fff"
        />
      </svg>
    </span>
  );
}

/**
 * Streak flame icon (pastel).
 */
function FlameIcon() {
  return (
    <span style={{
      display: "inline-flex",
      alignItems: "center",
      marginRight: 6,
      verticalAlign: "middle"
    }}>
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
        <path
          d="M12 2C12 4.5 16 7.5 16 12.5c0 2.2-1.8 4-4 4s-4-1.8-4-4c0-3.3 4-8.6 4-10.5z"
          fill="#FCD8CD"
          stroke="#F8A11E"
          strokeWidth="1.1"
        />
        <ellipse cx="12" cy="15" rx="2" ry="1" fill="#F8A11E" opacity="0.3" />
      </svg>
    </span>
  );
}

/**
 * MiniCalendar: Show current week, highlight today with pastel blue.
 */
function MiniCalendar({ days }) {
  return (
    <div className={styles.calendarWidget}>
      <div className={styles.calendarHeader}>This Week</div>
      <div className={styles.calendarDaysRow}>
        {days.map((d, idx) => (
          <div
            key={idx}
            className={
              d.isToday ? styles.calendarDay + " " + styles.calendarToday : styles.calendarDay
            }
          >
            <span className={styles.dayLabel}>{d.day}</span>
            <div className={styles.dayCircle}>{d.date}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Dashboard;
