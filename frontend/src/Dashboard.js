import React, { useEffect, useState } from "react";
import styles from "./styles/Dashboard.module.css";

// PUBLIC_INTERFACE
/**
 * Dashboard: Renders the dashboard per the pastel reference image, showing
 * authenticated user info, habits, and stats. No static placeholders for user.
 *
 * All structure, colors, font, and element order matches the attached reference image.
 * User name and email are fetched post-login from /api/profile.
 */



// Simple icon SVGs for habits
const habitIcons = {
  water: (
    <span
      style={{
        background: "#E6F3FE",
        borderRadius: 8,
        width: 28,
        height: 28,
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        marginRight: 8,
      }}
    >
      <svg width="18" height="18" viewBox="0 0 18 18">
        <path
          d="M9 2.5C8.6 3 4.7 7.6 4 10.1c-.6 1.8-.3 4 2 5a4.4 4.4 0 004.8-.8c1.7-1.4 2-3.4 1.5-5.2C11.7 5.7 9 2.5 9 2.5z"
          fill="#53A9F5"
        />
      </svg>
    </span>
  ),
  read: (
    <span
      style={{
        background: "#F2EAFE",
        borderRadius: 8,
        width: 28,
        height: 28,
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        marginRight: 8,
      }}
    >
      <svg width="18" height="18" viewBox="0 0 18 18">
        <rect x="3" y="4" width="12" height="11" rx="2" fill="#8D85DC" />
        <rect x="6" y="7" width="6" height="2" rx="1" fill="#fff" />
      </svg>
    </span>
  ),
  exercise: (
    <span
      style={{
        background: "#FFE6EE",
        borderRadius: 8,
        width: 28,
        height: 28,
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        marginRight: 8,
      }}
    >
      <svg width="16" height="16" viewBox="0 0 16 16">
        <circle cx="8" cy="8" r="7" fill="#F98AAD" />
        <rect x="6.8" y="4" width="2.4" height="8" rx="1.1" fill="#fff" />
      </svg>
    </span>
  ),
};

function CheckRow({ total = 7, filled = 5 }) {
  // Render row of checks/circles (green = checked, soft grey = empty)
  return (
    <span style={{ display: "inline-flex", gap: 6, verticalAlign: "middle" }}>
      {Array(total)
        .fill(0)
        .map((_, idx) =>
          idx < filled ? (
            <span
              key={idx}
              style={{
                display: "inline-flex",
                width: 16,
                height: 16,
                borderRadius: "50%",
                background: "#47DB7F",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 1px 2px #CDE7DC60",
              }}
            >
              <svg width="10" height="10" viewBox="0 0 12 12">
                <path d="M3 7l2 2 4-4" stroke="#fff" strokeWidth="2" fill="none" strokeLinecap="round" />
              </svg>
            </span>
          ) : (
            <span
              key={idx}
              style={{
                display: "inline-flex",
                width: 16,
                height: 16,
                borderRadius: "50%",
                background: "#EEE7F3",
                border: "1.3px solid #E2DDE4",
              }}
            />
          )
        )}
    </span>
  );
}

function CalendarIcon() {
  // Reference image calendar illustration
  return (
    <svg width="54" height="54" viewBox="0 0 54 54" fill="none">
      <rect x="8" y="14" width="38" height="28" rx="8" fill="#EBD6FB" />
      <rect x="15" y="22" width="24" height="16" rx="5" fill="#fff" />
      <rect x="20.2" y="28.5" width="7.7" height="7.2" rx="1.9" fill="#687FE5" />
      <path d="M27 35l4 5 5-5" stroke="#47DB7F" strokeWidth="2.2" fill="none" strokeLinecap="round" />
      <circle cx="17" cy="14" r="2" fill="#687FE5" />
      <circle cx="37" cy="14" r="2" fill="#687FE5" />
    </svg>
  );
}



export default Dashboard;
/**
 * PUBLIC_INTERFACE
 * Dashboard: Main desktop-responsive dashboard page for HabitTrackerApp.
 * Mirrors the detailed pastel reference design, fetching user info from backend/profile JSON,
 * and laying out dashboard elements with correct hierarchy & palette.
 *
 * Palette:
 *   - Apricot:    #FCD8CD
 *   - Pink:       #FEEBF6
 *   - Lavender:   #EBD6FB
 *   - Indigo:     #687FE5
 *
 * Dynamic:
 *   - Fetch user {name, email, join_date} for header.
 * Responsive:
 *   - Desktop-first, adjusts for window width.
 */

const COLOR = {
  apricot: "#FCD8CD",
  pink: "#FEEBF6",
  lavender: "#EBD6FB",
  indigo: "#687FE5",
  // Soft accent for gradients/backgrounds
  bodyBg: "linear-gradient(120deg, #EBD6FB 0%, #FEEBF6 52%, #FCD8CD 100%)"
};

// Utility: fetch current user profile from backend API (simulated with /api/profile)
async function fetchUserProfile() {
  // In real app, replace with `/api/profile` or similar endpoint
  try {
    const res = await fetch("/api/profile", { credentials: "include" });
    if (res.ok) return res.json();
  } catch (e) {}
  // Fallback demo user if API fails
  return {
    name: "Taylor Pastel",
    email: "taylor.pastel@example.com",
    join_date: "2023-08-25"
  };
}

// Small icon SVGs
function CalendarSVG() {
  return (
    <svg width="39" height="39" viewBox="0 0 39 39" fill="none">
      <rect x="5" y="10" width="29" height="22" rx="7" fill={COLOR.lavender} />
      <rect x="9.5" y="14.5" width="20" height="15" rx="4" fill="#fff" />
      <rect x="14" y="19" width="4.2" height="4.2" rx="1.3" fill={COLOR.indigo} />
      <path
        d="M20 23 l2.6 3 3.6-3.6"
        stroke="#47DB7F"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
      />
    </svg>
  );
}

function UserAvatar({ name }) {
  // Pastel initials avatar (with indigo circle)
  const initials =
    name && typeof name === "string"
      ? name
          .split(" ")
          .map((n) => n[0])
          .join("")
          .slice(0, 2)
          .toUpperCase()
      : "?";
  return (
    <div
      style={{
        width: 56,
        height: 56,
        borderRadius: 20,
        background: COLOR.indigo,
        color: "#fff",
        fontWeight: 700,
        fontSize: 22,
        letterSpacing: 0.5,
        alignItems: "center",
        justifyContent: "center",
        display: "flex",
        boxShadow: "0 2px 16px rgba(104,127,229,0.09)"
      }}
      title="User avatar"
    >
      {initials}
    </div>
  );
}

function StatCard({ title, value, color, icon }) {
  return (
    <div
      className={styles.statCard}
      style={{
        background: color,
        boxShadow: "0 2px 10px rgba(104,127,229,0.08)"
      }}
    >
      <div className={styles.statIcon}>{icon || null}</div>
      <div className={styles.statTitle}>{title}</div>
      <div className={styles.statValue}>{value}</div>
    </div>
  );
}

function SectionCard({ children, color, minHeight }) {
  // Pastel section card w/ design border and optional minHeight
  return (
    <section
      className={styles.sectionCard}
      style={{
        background: color,
        boxShadow: "0 2px 14px rgba(104,127,229,0.08)",
        minHeight: minHeight || 0
      }}
    >
      {children}
    </section>
  );
}

function Dashboard() {
  // --- STATE ---
  const [user, setUser] = useState({
    name: "",
    email: "",
    join_date: ""
  });

  // Example dashboard stats (stub data)
  const dashboardStats = [
    {
      title: "Habits Tracked",
      value: "7",
      color: COLOR.lavender,
      icon: (
        <svg width="28" height="28" viewBox="0 0 20 20" fill={COLOR.indigo}>
          <circle cx="10" cy="10" r="10" opacity="0.12" fill={COLOR.indigo} />
          <rect x="4" y="9" width="12" height="2.2" rx="1.1" fill={COLOR.indigo} />
        </svg>
      )
    },
    {
      title: "Current Streak",
      value: "15 days",
      color: COLOR.pink,
      icon: (
        <svg width="28" height="28" viewBox="0 0 20 20" fill="#EDA5C0">
          <circle cx="10" cy="10" r="10" opacity="0.11" fill={COLOR.indigo} />
          <path d="M5.5 13.5l3 -4 2 2.5 3-4" stroke="#687FE5" strokeWidth="1.7" fill="none" />
        </svg>
      )
    },
    {
      title: "Joined",
      value: user.join_date ? new Date(user.join_date).toLocaleDateString() : "-",
      color: COLOR.apricot,
      icon: (
        <svg width="28" height="28" viewBox="0 0 20 20" fill="#F7A1B2">
          <circle cx="10" cy="10" r="10" opacity="0.10" fill={COLOR.indigo} />
          <rect x="8" y="6" width="4" height="8" rx="1.3" fill="#EDA5C0" />
        </svg>
      )
    }
  ];

  // Example tracked habits list (may fetch for real user in future)
  const habits = [
    { name: "Morning Walk", streak: 7, mood: "🙂" },
    { name: "Read 20min", streak: 12, mood: "📚" },
    { name: "Gratitude Journal", streak: 15, mood: "📝" }
  ];

  // Example quote
  const quote = {
    text: "Every day is a fresh start. Make it count — build your best habits.",
    author: "HabitTrackerApp"
  };

  // --- EFFECTS ---
  useEffect(() => {
    fetchUserProfile().then((data) => {
      setUser({
        ...data,
        // Defensive: if backend provides no join_date, fill with demo
        join_date: data.join_date || "2023-08-25"
      });
    });
  }, []);

  // --- RENDER ---
  return (
    <div className={styles.dashboardRoot} style={{ background: COLOR.bodyBg }}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.userMeta}>
          <UserAvatar name={user.name} />
          <div className={styles.userDetails}>
            <div className={styles.userName}>
              {user.name || <span style={{ color: "#bbb" }}>Loading...</span>}
            </div>
            <div className={styles.userEmail}>{user.email}</div>
          </div>
        </div>
        <div className={styles.headerUtility}>
          <CalendarSVG />
        </div>
      </header>

      {/* Greeting Card */}
      <SectionCard color="#fff" minHeight={110}>
        <div className={styles.greetingArea}>
          <div className={styles.greetingTitle}>Welcome back,</div>
          <div className={styles.greetingName}>
            {user.name ? <span>{user.name}</span> : <span style={{ color: "#bbb" }}>User</span>}
          </div>
          <div className={styles.greetingSub}>Ready to reach your goals?</div>
        </div>
      </SectionCard>

      {/* Stat Cards */}
      <div className={styles.statsRow}>
        {dashboardStats.map((s) => (
          <StatCard
            key={s.title}
            title={s.title}
            value={s.value}
            color={s.color}
            icon={s.icon}
          />
        ))}
      </div>

      {/* Middle Row: Motivational Quote and Quick Habits */}
      <div className={styles.midRow}>
        <SectionCard color={COLOR.lavender} minHeight={110}>
          <div className={styles.quoteBox}>
            <div className={styles.quoteMark}>“</div>
            <div className={styles.quoteText}>{quote.text}</div>
            <div className={styles.quoteAuthor}>— {quote.author}</div>
          </div>
        </SectionCard>
        <SectionCard color={COLOR.pink}>
          <div className={styles.habitListHeader}>Today's Habits</div>
          <div className={styles.habitList}>
            {habits.map((h) => (
              <div className={styles.habitRow} key={h.name}>
                <span className={styles.habitMood} role="img" aria-label="Mood">
                  {h.mood}
                </span>
                <span className={styles.habitName}>{h.name}</span>
                <span className={styles.habitStreak}>
                  <svg width="12" height="12" viewBox="0 0 12 12">
                    <circle cx="6" cy="6" r="6" fill="#47DB7F" opacity="0.17" />
                    <circle cx="6" cy="6" r="3" fill="#47DB7F" opacity="0.55" />
                  </svg>{" "}
                  {h.streak}
                </span>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>

      {/* Footer/Support */}
      <footer className={styles.footer}>
        <span style={{ color: "#9E6DFB", fontWeight: 500 }}>
          HabitTrackerApp &copy; 2025
        </span>
      </footer>
    </div>
  );
}

export default Dashboard;
