import React, { useEffect, useMemo, useState } from "react";
import styles from "./styles/Dashboard.module.css";

/**
 * PUBLIC_INTERFACE
 * Dashboard page: Full rewrite to match dashboard_design_notes.md and the provided image.
 * - Dynamically fetches all user/habit/progress/quote data for the logged-in user.
 * - Implements robust loading and error states.
 * - Layout: Header, main (habits tracker), sidebar (progress, quote, calendar), all responsive with precise style.
 */

function Dashboard() {
  // State variables/hooks must always be at the top-level and unconditional
  const [user, setUser] = useState(null);
  const [habits, setHabits] = useState(null);
  const [progress, setProgress] = useState(null); // Most recent (today's or last) progress snapshot
  const [quote, setQuote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userId, setUserId] = useState(null);
  // These will always be called (useMemo)
  const todayObj = useMemo(() => new Date(), []);
  const weekDays = useMemo(() => {
    // Construct this week: Sun..Sat, highlight today
    const days = [];
    const todayIdx = todayObj.getDay();
    for (let i = 0; i < 7; ++i) {
      let d = new Date(todayObj);
      d.setDate(todayObj.getDate() - todayIdx + i);
      days.push({
        label: d.toLocaleString("en-US", { weekday: "short" }),
        date: d.getDate(),
        isToday: i === todayIdx,
      });
    }
    return days;
  }, [todayObj]);
  const sidebarMetrics = useMemo(() => {
    let totalHabits = habits ? habits.length : 0;
    let completedToday = 0;
    let longestStreak = 0;
    if (habits && progress) {
      // completedToday: count of habits checked true in progress.habit_checkmarks
      completedToday = Object.values(progress.habit_checkmarks || {}).filter(Boolean).length;
      // Longest streak: max habit.streak from all
      longestStreak = habits.reduce((mx, h) => Math.max(mx, h.streak || 0), 0);
    }
    return [
      { label: "Total Habits", value: totalHabits },
      { label: "Completed Today", value: completedToday },
      { label: "Longest Streak", value: longestStreak },
    ];
  }, [habits, progress]);
  // Always declare hooks (useEffect) unconditionally (no conditionals, loops, or early returns)
  useEffect(() => {
    let ignore = false;
    setLoading(true);
    setError(null);
    // Step 1: Find userId (simulate auth for now, fallback to first user in db)
    fetch(`/api/user/1`)
      .then(async response => {
        if (!response.ok) throw new Error("User not found.");
        const resJson = await response.json();
        if (!resJson.success || !resJson.user) throw new Error("Invalid user data.");
        setUserId(resJson.user.id);
        setUser(resJson.user);
        return resJson.user.id;
      })
      .then((uid) =>
        Promise.all([
          fetch(`/api/habits?user_id=${uid}`).then(r => r.json()),
          fetch(`/api/progress?user_id=${uid}`).then(r => r.json()),
          fetch(`/api/quote`).then(r => r.json()),
        ])
      )
      .then(([habitsRes, progressRes, quoteRes]) => {
        if (ignore) return;
        if (!habitsRes.success) throw new Error("Habits fetch failed.");
        setHabits(habitsRes.habits || []);
        if (!progressRes.success) throw new Error("Progress fetch failed.");
        let today = new Date().toISOString().slice(0, 10);
        let todays = (progressRes.progress || []).find(p => p.date === today);
        let last = (progressRes.progress || [])
          .slice()
          .sort((a, b) => ((a.date < b.date) ? 1 : -1))[0] || null;
        setProgress(todays || last || null);
        if (!quoteRes.success) throw new Error("Quote fetch failed.");
        setQuote(quoteRes.quote || null);
        setLoading(false);
      })
      .catch((e) => {
        if (ignore) return;
        setError("Could not load dashboard data. " + (e.message || ""));
        setLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, []);
  // At this point, all hooks are above. Now use conditional logic for rendering.
  if (loading) {
    return (
      <div className={styles.dashboardBg} style={{ display: "flex", height: "100vh", alignItems: "center", justifyContent: "center" }}>
        <div style={{ color: "var(--ht-primary)", fontWeight: 700, fontSize: "1.3rem" }}>Loading your dashboard...</div>
      </div>
    );
  }
  if (error) {
    return (
      <div className={styles.dashboardBg} style={{ display: "flex", height: "100vh", alignItems: "center", justifyContent: "center" }}>
        <div style={{ color: "var(--ht-error)", fontWeight: 700, fontSize: "1.15rem" }}>{error}</div>
      </div>
    );
  }
  if (!user) {
    return (
      <div className={styles.dashboardBg} style={{ display: "flex", height: "100vh", alignItems: "center", justifyContent: "center" }}>
        <div style={{ color: "var(--ht-error)", fontWeight: 700, fontSize: "1.15rem" }}>No user data found.</div>
      </div>
    );
  }

  // Today's date, for greeting and calendar computations
  const todayObj = useMemo(() => new Date(), []);
  const weekDays = useMemo(() => {
    // Construct this week: Sun..Sat, highlight today
    const days = [];
    const todayIdx = todayObj.getDay();
    for (let i = 0; i < 7; ++i) {
      let d = new Date(todayObj);
      d.setDate(todayObj.getDate() - todayIdx + i);
      days.push({
        label: d.toLocaleString("en-US", { weekday: "short" }),
        date: d.getDate(),
        isToday: i === todayIdx,
      });
    }
    return days;
  }, [todayObj]);

  // Sidebar snapshot: total habits, completed today, longest streak
  const sidebarMetrics = useMemo(() => {
    let totalHabits = habits ? habits.length : 0;
    let completedToday = 0;
    let longestStreak = 0;
    if (habits && progress) {
      // completedToday: count of habits checked true in progress.habit_checkmarks
      completedToday = Object.values(progress.habit_checkmarks || {}).filter(Boolean).length;
      // Longest streak: max habit.streak from all
      longestStreak = habits.reduce((mx, h) => Math.max(mx, h.streak || 0), 0);
    }
    return [
      { label: "Total Habits", value: totalHabits },
      { label: "Completed Today", value: completedToday },
      { label: "Longest Streak", value: longestStreak },
    ];
  }, [habits, progress]);

  // Main habits for "Your Habits This Week" -- for the week tracker
  function HabitsList() {
    if (!habits || habits.length === 0) {
      return (
        <div style={{ color: "var(--ht-error)", fontWeight: 500, padding: 16, borderRadius: 10, background: "var(--ht-bg-secondary)" }}>
          No habits found. Start by adding your first habit!
        </div>
      );
    }
    return (
      <div className={styles.habitCardRow} style={{ marginBottom: 16 }}>
        {habits.map((h) => (
          <div className={styles.habitCard} key={h.id}>
            <div className={styles.habitCardTopRow}>
              <HabitIcon icon={h.icon} />
              <span className={styles.habitName}>{h.name}</span>
              {(h.streak > 1) && (
                <span className={styles.streakIcon}><FlameIcon /><span className={styles.streakCount}>{h.streak}d</span></span>
              )}
            </div>
            <div className={styles.habitDays}>
              {Array.isArray(h.days)
                ? h.days.map((checked, idx) => <CheckCircle checked={checked} key={idx} />)
                : Array(7).fill(false).map((_, idx) => <CheckCircle checked={false} key={idx} />)}
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Mini calendar: show current week with today pastel-highlighted
  function CalendarCard() {
    return (
      <div className={styles.calendarWidget}>
        <div className={styles.calendarHeader}>This Week</div>
        <div className={styles.calendarDaysRow}>
          {weekDays.map((d, idx) => (
            <div key={idx} className={d.isToday ? `${styles.calendarDay} ${styles.calendarToday}` : styles.calendarDay}>
              <span className={styles.dayLabel}>{d.label}</span>
              <div className={styles.dayCircle}>{d.date}</div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Quote of the Day
  function QuoteCard() {
    return (
      <div className={styles.widget}>
        <div className={styles.widgetLabel}>Quote of the Day</div>
        <blockquote className={styles.quoteBody}>
          <span className={styles.quoteText}>
            &ldquo;{quote ? quote.text : "No quote found."}&rdquo;
          </span>
          <span className={styles.quoteAuthor}>{quote && quote.author ? `— ${quote.author}` : ""}</span>
        </blockquote>
      </div>
    );
  }

  // Progress metrics snapshot (sidebar)
  function ProgressSnapshot() {
    return (
      <div className={styles.widget}>
        <div className={styles.widgetLabel}>Progress Snapshot</div>
        <div className={styles.progressList}>
          {sidebarMetrics.map((stat, i) => (
            <div className={styles.progressStat} key={i}>
              <span className={styles.progressValue}>{stat.value}</span>
              <span className={styles.progressLabel}>{stat.label}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={styles.dashboardBg} style={{ minHeight: "100vh" }}>
      {/* Header: sticky top, greeting, date, avatar/email */}
      <header className={styles.header}>
        <div className={styles.logo}>HabitTrackerApp</div>
        <div className={styles.greetingsZone}>
          <div className={styles.greeting}>
            Good Morning, <span className={styles.name}>{user.name || ""}!</span>
          </div>
          <div className={styles.date}>
            Today is {todayObj.toLocaleString("en-US", { weekday: "long" })}, {todayObj.toLocaleString("en-US", { month: "long", day: "numeric" })}
          </div>
        </div>
        <div className={styles.avatar}>
          {user.avatar ? (
            <img src={user.avatar} alt={user.name} className={styles.avatarImg} style={{ borderRadius: "50%", width: 38, height: 38 }} />
          ) : (
            <span role="img" aria-label="user" className={styles.avatarImg}>🧑‍💻</span>
          )}
          <span className={styles.avatarEmail}>{user.email}</span>
        </div>
      </header>
      {/* Main content area: horizontal flex, two zones */}
      <main className={styles.mainWrapper}>
        {/* Left: Habits tracker section */}
        <section className={styles.habitSection} style={{ minHeight: 300 }}>
          <h1 className={styles.sectionTitle}>Your Habits This Week</h1>
          <HabitsList />
        </section>
        {/* Right: Sidebar widgets (progress, quote, calendar) */}
        <aside className={styles.sidebar}>
          <ProgressSnapshot />
          <QuoteCard />
          <CalendarCard />
        </aside>
      </main>
    </div>
  );
}

/** Helper component: Colored habit icon for the dashboard, SVGs mapped by name */
function HabitIcon({ icon }) {
  // Map: habit.icon to pastel colored icon SVG
  switch (icon) {
    case "water_drop":
    case "hydrate":
      return (
        <span style={iconWrap("#D1EAFD")}>
          {/* Water bottle/drop */}
          <svg width="28" height="28" viewBox="0 0 24 24" fill="#53A9F5">
            <path d="M12.07 3.5c-.2.1-5 5.6-6 8.8-.8 2.2-.5 5.3 2.5 6.6 2.9 1.2 6.4.5 8.1-2 .8-1.1 1.2-2.3.9-3.7-.8-3-5.2-9.1-5.5-9.7zm.1 14c-2.7 0-4.5-1.7-4.2-4.5l.1-.5.8.5a3.6 3.6 0 002.7.8c.9.1 1.8-.1 2.6-.7l.8-.6.1.5c.3 2.8-1.5 4.5-4.2 4.5z" />
          </svg>
        </span>
      );
    case "book":
      return (
        <span style={iconWrap("#E1DDFC")}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="#B388FF">
            <rect x="6" y="6" width="12" height="12" rx="6" fill="#fff" />
            <path d="M8.2 9.3H16m-5.6 2.55H16M8.2 14H16" stroke="#B388FF" strokeWidth="1.7" strokeLinecap="round" />
          </svg>
        </span>
      );
    case "lotus":
    case "meditate":
      return (
        <span style={iconWrap("#FEEBF6")}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="#F7A1B2">
            <path d="M12 3a9 9 0 00-9 9 8.98 8.98 0 008 8.93A8.98 8.98 0 0021 12a9 9 0 00-9-9zm0 16c-3.9 0-7-3.1-7-7a6.978 6.978 0 017-7v14z" />
          </svg>
        </span>
      );
    case "heartbeat":
    case "move":
      return (
        <span style={iconWrap("#FFD7DD")}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="#FF8C94">
            <path d="M16.5 4.2c-1.7 0-3.4.97-4.24 2.43C11.1 5.17 9.31 4.12 7.5 4.12 4.36 4.12 2 6.8 2 10c0 3.95 6.24 8.36 9.12 9.97.56.31 1.27.31 1.83 0C15.76 18.36 22 13.98 22 10c0-3.2-2.36-5.8-5.5-5.8z"/>
          </svg>
        </span>
      );
    case "journal":
      return (
        <span style={iconWrap("#E1DDFC")}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="#C48DDC">
            <rect x="4.5" y="3.5" width="15" height="17" rx="4" fill="#E1DDFC"/>
            <rect x="7" y="7" width="9" height="6" rx="2" fill="#fff"/>
          </svg>
        </span>
      );
    case "walk":
      return (
        <span style={iconWrap("#D1EAFD")}>
          <svg width="28" height="28" viewBox="0 1 24 22" fill="#687FE5">
            <circle cx="12" cy="7" r="3" fill="#687FE5"/>
            <path d="M12 10v7M12 17c0-1 1-2 2-2h1M12 10c-2 0-3 1.5-3 3l.5 2m2.5 2v-5" stroke="#687FE5" strokeWidth="1.3"/>
          </svg>
        </span>
      );
    default:
      // Unknown: blue pastel circle
      return (
        <span style={iconWrap("#D1EAFD")}>
          <svg width="28" height="28"><circle cx="14" cy="14" r="14" fill="#D1EAFD" /></svg>
        </span>
      );
  }
}
function iconWrap(color) {
  // Pastel circular with shadow
  return {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    width: 38,
    height: 38,
    borderRadius: 19,
    background: color,
    marginRight: 16,
    boxShadow: "0 2px 7px rgba(104,127,229,0.07)"
  };
}

/** SVG check circle for day; green filled if checked, muted border if not. */
function CheckCircle({ checked }) {
  return checked ? (
    <span className={styles.checkCircleChecked}>
      <svg width="18" height="18" viewBox="0 0 15 15" fill="none">
        <circle cx="7.5" cy="7.5" r="7.5" fill="#54CB73"/>
        <path d="M5 8.2l2 2 3-3" stroke="#FFF" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
    </span>
  ) : (
    <span className={styles.checkCircleEmpty}>
      <svg width="18" height="18" viewBox="0 0 15 15" fill="none">
        <circle cx="7.5" cy="7.5" r="7" fill="#fff" stroke="#DADEE3" strokeWidth="1.2"/>
      </svg>
    </span>
  );
}

/** Small streak 'flame' icon in pastel orange with a shadow */
function FlameIcon() {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", marginRight: 3, verticalAlign: "middle" }}>
      <svg width="21" height="21" viewBox="0 0 22 22" fill="none">
        <path
          d="M12 2C12 4.5 16 7.5 16 12.5c0 2.2-1.8 4-4 4s-4-1.8-4-4c0-3.3 4-8.6 4-10.5z"
          fill="#FCD8CD"
          stroke="#F8A11E"
          strokeWidth="1.1"
        />
        <ellipse cx="12" cy="15" rx="2" ry="1" fill="#F8A11E" opacity="0.3"/>
      </svg>
    </span>
  );
}

export default Dashboard;
