import React, { useEffect, useState, lazy, Suspense } from "react";
import { Link } from "react-router-dom";

import ProgressSnapshotWidget from "./ProgressSnapshotWidget";
import QuoteOfTheDayWidget from "./QuoteOfTheDayWidget";
import UserHeader from "./UserHeader";
import styles from "./styles/Dashboard.module.css";

// Dynamic import for CalendarWithEmotions using React.lazy for code-splitting
const CalendarWithEmotions = lazy(() => import("./CalendarWithEmotions"));

// Spinner: pastel, dashboard-consistent
function PastelSpinner({size = 36, duration = 1.1}) {
  return (
    <span
      style={{
        display: "inline-block",
        width: size,
        height: size,
        border: `${size / 9.8}px solid #ecdff7`,
        borderTop: `${size / 9.8}px solid #a898ea`,
        borderRadius: "50%",
        animation: `spin ${duration}s linear infinite`,
        margin: "0 auto",
      }}
    >
      <style>
        {`@keyframes spin {
          0% { transform: rotate(0deg);}
          100% { transform: rotate(360deg);}
        }`}
      </style>
    </span>
  );
}

// Card shell for widgetized async components, always applies pastel theme, rounds, shadow, spacing
function DashboardCard({ children, error, empty, loading, loadingText, emptyText, errorText, minHeight = 140, style = {} }) {
  // Present in order: loading, error, empty, normal children
  return (
    <section
      style={{
        background: "var(--ht-bg-secondary, #FCD8CD)",
        borderRadius: 22,
        boxShadow: "0 2px 10px rgba(104,127,229,0.07)",
        padding: "28px 20px 24px 20px",
        marginBottom: 26,
        minHeight,
        width: "100%",
        transition: "box-shadow 0.18s",
        position: "relative",
        ...style,
      }}
    >
      {loading ? (
        <div
          style={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            color: "var(--ht-secondary-text,#7A7F92)",
            fontWeight: 500,
            paddingTop: 12,
            paddingBottom: 12,
          }}
        >
          <PastelSpinner size={36} />
          <span style={{ marginTop: 16, fontSize: "1.04em", opacity: 0.79 }}>{loadingText || "Loading..."}</span>
        </div>
      ) : error ? (
        <div
          style={{
            width: "100%",
            color: "var(--ht-error, #F87A77)",
            background: "rgba(248,122,119,0.08)",
            borderRadius: 15,
            textAlign: "center",
            fontWeight: 600,
            fontSize: "1.08em",
            padding: "18px 0",
            margin: "18px 0"
          }}
        >
          {errorText || error}
        </div>
      ) : empty ? (
        <div
          style={{
            width: "100%",
            color: "var(--ht-secondary-text, #A49BB7)",
            fontWeight: 500,
            fontStyle: "italic",
            textAlign: "center",
            fontSize: "1.06em",
            padding: "16px 0"
          }}
        >
          {emptyText || "No data to display."}
        </div>
      ) : (
        children
      )}
    </section>
  );
}


// Async Habits List Widget (with error/loading/empty handling)
// Real app would fetch /api/habits?user_id=..., here simulate with localStorage/session and /api/habits if user available.
function HabitsListWidget() {
  const [habits, setHabits] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    let mounted = true;
    // Find user id from local/session storage (the standard for the app)
    let user = null;
    try {
      user = JSON.parse(sessionStorage.getItem("habit_user") || localStorage.getItem("habit_user") || "null");
    } catch {}
    if (!user || !user.id) {
      setUserId(null);
      setHabits([]);
      setLoading(false);
      setErr("No user session found");
      return;
    }
    setUserId(user.id);
    setLoading(true);
    setErr("");
    setHabits(null);

    fetch(`/api/habits?user_id=${user.id}`)
      .then((resp) => resp.ok ? resp.json() : Promise.reject("Failed to fetch"))
      .then((d) => {
        if (!mounted) return;
        if (!d.success) throw new Error("API returned failure");
        setHabits(Array.isArray(d.habits) ? d.habits : []);
      })
      .catch(() => {
        if (mounted) {
          setErr("Could not load habits. Please try again.");
          setHabits([]);
        }
      }).finally(() => {
        mounted && setLoading(false);
      });
    return () => { mounted = false; };
  }, []);

  // Habits empty state: no habits for this user account
  const isEmpty = Array.isArray(habits) && habits.length === 0;

  // Icon palette for pastel cards
  function iconBox(icon, idx) {
    const bgList = [
      "var(--ht-surface,#EBD6FB)",
      "#D1EAFD",
      "#E1DDFC",
      "#FFD7DD",
      "#FBE3E6"
    ];
    const bg = bgList[idx % bgList.length];
    // SVGs for most common icons (hydrate, meditate, book, heartbeat, etc)
    const iconSvg = {
      water_drop: (
        <svg height="26" width="26" viewBox="0 0 20 20" fill="#53A9F5"><path d="M10.1 3.3c-.2.1-4.6 5.1-5.5 8.1-.7 2.1-.4 4.9 2.3 6a5.3 5.3 0 005.6-1c2-1.7 2.4-4 1.7-6.2-.8-2.8-4-7-4-7zm.2 12.4c-2.4 0-4-1.7-3.8-4.1l.1-.5.8.6c.6.5 1.6.7 2.4.7s1.8-.3 2.4-.7l.8-.6.1.5c.2 2.4-1.4 4.1-3.8 4.1z"/></svg>
      ),
      book: (
        <svg width="26" height="26" viewBox="0 0 20 20" fill="#C48DDC"><path d="M3 4.5C3 3.7 3.7 3 4.5 3h6c.8 0 1.5.7 1.5 1.5v11c0 .3-.2.5-.5.5s-.5-.2-.5-.5V4.5c0-.3-.2-.5-.5-.5h-6C3.2 4 3 4.2 3 4.5V16c0 .3.2.5.5.5s.5-.2.5-.5V4.5zm13 0c0-.8-.7-1.5-1.5-1.5h-2c-.3 0-.5.2-.5.5s.2.5.5.5h2c.3 0 .5.2.5.5v12c0 .3-.2.5-.5.5h-2c-.3 0-.5.2-.5.5s.2.5.5.5h2c.8 0 1.5-.7 1.5-1.5V4.5z"/></svg>
      ),
      lotus: (
        <svg width="26" height="26" viewBox="0 0 20 20" fill="#F7A1B2"><path d="M10 17s-5.7-2.8-7.2-6C1 7.7 3.5 5 6.1 5c1.3 0 2.5.7 3.2 1.8C10.4 5.7 11.6 5 12.9 5c2.6 0 5.1 2.7 3.3 6C15.7 14.2 10 17 10 17z"/></svg>
      ),
      heartbeat: (
        <svg width="28" height="26" viewBox="0 0 20 20" fill="#EF4565"><path d="M10 17l-2.8-3.7c-.5.2-1 .3-1.5.3-2.2 0-4-1.8-4-4s1.8-4 4-4c1.1 0 2 .5 2.8 1.2C11.2 6.5 12.1 6 13.2 6c2.2 0 4 1.8 4 4s-1.8 4-4 4c-.5 0-1-.1-1.5-.3L10 17z"/></svg>
      ),
      journal: (
        <svg width="26" height="26" viewBox="0 0 20 20" fill="#7C335C"><rect x="4" y="3" width="12" height="14" rx="2"/><rect x="7.5" y="5" width="5" height="1.5" fill="#fff"/><rect x="7.5" y="8" width="4.5" height="1.5" fill="#fff"/></svg>
      ),
      walk: (
        <svg width="26" height="26" viewBox="0 0 20 20" fill="#27785D"><circle cx="10" cy="10" r="9" fill="#B8F5C5"/><path d="M11 7a1 1 0 1 0-2 0v3h2V7zm-2 5a1 1 0 1 0 2 0v3h-2v-3z" fill="#27785D"/></svg>
      ),
      default: (
        <svg width="24" height="24" viewBox="0 0 20 20" fill="#687FE5"><circle cx="10" cy="10" r="10"/></svg>
      )
    };
    return (
      <span
        style={{
          background: bg,
          borderRadius: 11,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: 36,
          height: 36,
          marginRight: 16,
        }}
      >
        {iconSvg[icon] || iconSvg.default}
      </span>
    );
  }
  // Render progress check circles: expect habits[i].days is array of 7 booleans (Sun...Sat)
  function renderProgress(habit) {
    return (
      <div style={{ display: "flex", gap: 6, marginLeft: 7 }}>
        {(habit.days || []).map((done, i) =>
          <span
            key={i}
            style={{
              width: 16,
              height: 16,
              background: done ? "var(--ht-primary,#54CB73)" : "#f4f2fb",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: `1.2px solid ${done ? "#54CB73" : "#dadee3"}`,
            }}>
            {done && (
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M3 7l2 2 4-4" stroke="white" strokeWidth="2" strokeLinecap="round" />
              </svg>
            )}
          </span>
        )}
      </div>
    );
  }

  // Null-case pad in card for vertical alignment
  if (loading || err || isEmpty) {
    return (
      <DashboardCard
        minHeight={170}
        loading={loading}
        error={err}
        errorText={err}
        empty={isEmpty}
        emptyText="No habits found. Try creating one!"
        loadingText="Loading habits..."
      />
    );
  }

  return (
    <DashboardCard minHeight={170}>
      <div style={{
        width: "100%",
        marginBottom: 14,
        color: "var(--ht-primary-text,#232B3A)",
        fontWeight: 700,
        fontSize: "1.16em",
        letterSpacing: 0.01,
      }}>
        Your Habits This Week
      </div>
      <div>
        {habits.map((h, idx) => (
          <div key={h.id || h.name || idx}
            style={{
              display: "flex",
              alignItems: "center",
              padding: "8px 0",
              marginBottom: idx < habits.length - 1 ? 12 : 0
            }}
          >
            {iconBox(h.icon || "default", idx)}
            <div style={{
              fontSize: "1.10em",
              fontWeight: 600,
              letterSpacing: 0,
              flex: "1 1 0",
              color: "var(--ht-primary-text,#232B3A)",
              minWidth: 0,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap"
            }}>
              {h.name}
            </div>
            {renderProgress(h)}
            {h.streak > 0 && (
              <span title="Current streak" style={{ marginLeft: 10, color: "#F8A11E", fontWeight: 600, fontSize: "1.00em", display: "flex", alignItems: "center", gap: 3 }}>
                <svg height="14" width="14" viewBox="0 0 20 20" fill="#fcd768" style={{marginRight:1}}><path d="M13.2 16.3l-3.2-2-3.2 2 .6-3.7-2.7-2.5 3.8-.5L10 6l1.7 3.6 3.8.5-2.7 2.4.6 3.8z"/></svg>{h.streak}
              </span>
            )}
          </div>
        ))}
      </div>
    </DashboardCard>
  );
}

/**
 * PUBLIC_INTERFACE
 * Dashboard page for logged-in users.
 * Renders card layout, navigation shortcuts, and all major dashboard widgets (responsive pastel design).
 */
function Dashboard() {
  // Use fresh user object if available for widget userId prop
  let user = null;
  try {
    user = JSON.parse(sessionStorage.getItem("habit_user") || localStorage.getItem("habit_user") || "null");
  } catch {}
  const userId = (user && user.id) ? user.id : undefined;

  return (
    <div className={styles.dashboardContainer}>
      <UserHeader />
      {/* Pastel SPA nav */}
      <nav className={styles.dashboardShortcutsNav} aria-label="Dashboard navigation shortcuts">
        <Link to="/dashboard/new-habit" className={styles.dashboardShortcutBtn}
          style={{
            background: "linear-gradient(120deg, #D1E9FA 70%, #ECCCF7 100%)",
            color: "#35295D",
            border: "none", borderRadius: 14, padding: "12px 19px",
            fontWeight: 600, fontSize: "1.07rem", letterSpacing: "0.01em",
            boxShadow: "0 2px 8px rgba(123,97,255,0.10)", transition: "transform 0.12s, box-shadow 0.15s",
            textDecoration: "none", outline: "none", cursor: "pointer",
          }} >
          + Create New Habit
        </Link>
        <Link to="/dashboard/habits" className={styles.dashboardShortcutBtn}
          style={{
            background: "linear-gradient(120deg, #E8E5FC 70%, #F9E9F0 100%)",
            color: "#483372", border: "none", borderRadius: 14, padding: "12px 19px",
            fontWeight: 600, fontSize: "1.07rem", letterSpacing: "0.01em",
            boxShadow: "0 2px 8px rgba(104,127,229,0.09)", transition: "transform 0.12s, box-shadow 0.15s",
            textDecoration: "none", outline: "none", cursor: "pointer",
          }} >
          View Habits List
        </Link>
        <Link to="/dashboard/progress" className={styles.dashboardShortcutBtn}
          style={{
            background: "linear-gradient(120deg, #FBEFF3 70%, #FDECED 100%)",
            color: "#7C335C", border: "none", borderRadius: 14, padding: "12px 19px",
            fontWeight: 600, fontSize: "1.07rem", letterSpacing: "0.01em",
            boxShadow: "0 2px 8px rgba(247,161,178,0.08)", transition: "transform 0.12s, box-shadow 0.15s",
            textDecoration: "none", outline: "none", cursor: "pointer",
          }} >
          Track Progress
        </Link>
        <Link to="/dashboard/profile" className={styles.dashboardShortcutBtn}
          style={{
            background: "linear-gradient(120deg, #EBFAE6 70%, #D2E7FB 100%)",
            color: "#27785D", border: "none", borderRadius: 14, padding: "12px 19px",
            fontWeight: 600, fontSize: "1.07rem", letterSpacing: "0.01em",
            boxShadow: "0 2px 8px rgba(71,219,127,0.08)", transition: "transform 0.12s, box-shadow 0.15s",
            textDecoration: "none", outline: "none", cursor: "pointer",
          }} >
          Profile
        </Link>
        <Link to="/dashboard/settings" className={styles.dashboardShortcutBtn}
          style={{
            background: "linear-gradient(120deg, #FDF5E6 70%, #E3F3FA 100%)",
            color: "#AA5A27", border: "none", borderRadius: 14, padding: "12px 19px",
            fontWeight: 600, fontSize: "1.07rem", letterSpacing: "0.01em",
            boxShadow: "0 2px 8px rgba(255,211,134,0.07)", transition: "transform 0.12s, box-shadow 0.15s",
            textDecoration: "none", outline: "none", cursor: "pointer",
          }}>
          Settings
        </Link>
      </nav>
      {/* Responsive dashboard flex row layout:
          Left: Habits this week (main card), right: sidebar with progress, quote, calendar
      */}
      <div className={styles.dashboardResponsiveGrid}>
        <main className={styles.dashboardMainColumn}>
          <HabitsListWidget />
        </main>
        <aside className={styles.dashboardSidebarColumn}>
          <DashboardCard
            loading={false}
            error={false}
            minHeight={158}
            style={{marginBottom: 24, background: "var(--ht-surface,#FEEBF6)"}}
          >
            {/* ProgressSnapshotWidget already handles async + states */}
            <ProgressSnapshotWidget userId={userId} />
          </DashboardCard>
          <DashboardCard
            loading={false}
            error={false}
            minHeight={90}
            style={{marginBottom: 20}}
          >
            {/* QuoteOfTheDayWidget already handles async + states */}
            <QuoteOfTheDayWidget />
          </DashboardCard>

          {/* New: Full pastel emotion calendar with emoji modal */}
          <DashboardCard
            loading={false}
            error={false}
            minHeight={170}
            style={{marginBottom: 0, background: "var(--ht-surface,#EBD6FB)"}}>
            {/* CalendarWithEmotions */}
            <Suspense fallback={<div>Loading calendar...</div>}>
              {/* Add emotion state and change handler for the calendar */}
              <EmotionCalendarWrapper />
            </Suspense>
          </DashboardCard>
        </aside>
      </div>
    </div>
  );
}

// PUBLIC_INTERFACE
function EmotionCalendarWrapper() {
  // This state structure: { "YYYY-MM-DD": "emoji" }
  const [emotionsPerDay, setEmotionsPerDay] = useState(() => {
    // Try localStorage for persistence, or start empty
    try {
      const data = localStorage.getItem("habit_emotions_per_day");
      return data ? JSON.parse(data) : {};
    } catch {
      return {};
    }
  });

  // Handler for changing emotion
  // PUBLIC_INTERFACE
  function onEmotionChange(dateStr, emoji) {
    setEmotionsPerDay((prev) => {
      const updated = { ...prev };
      if (emoji) {
        updated[dateStr] = emoji;
      } else {
        delete updated[dateStr];
      }
      // Persist
      try {
        localStorage.setItem("habit_emotions_per_day", JSON.stringify(updated));
      } catch {}
      return updated;
    });
  }

  // CalendarWithEmotions expects current month/year
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();

  return (
    <CalendarWithEmotions
      emotionsPerDay={emotionsPerDay}
      onEmotionChange={onEmotionChange}
      month={month}
      year={year}
    />
  );
}

export default Dashboard;
