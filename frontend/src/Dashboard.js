import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import UserHeader from "./UserHeader";
import ProgressSnapshotWidget from "./ProgressSnapshotWidget";
import MiniCalendarWidget from "./MiniCalendarWidget";
import CalendarWithEmotions from "./CalendarWithEmotions";
import QuoteOfTheDayWidget from "./QuoteOfTheDayWidget";
import "./styles/Dashboard.module.css";

// Utilities for API calls
const API_BASE = "/api";

// Helper: fetch with auth headers cookie/session
async function fetchWithAuth(url, options = {}) {
  return fetch(url, {
    credentials: "include",
    ...options,
    headers: {
      ...(options.headers || {}),
      "Content-Type": "application/json",
    },
  });
}

// ----------------- Dashboard Main -----------------

/**
 * PUBLIC_INTERFACE
 * Dashboard: Fully interactive page after login, providing:
 * - User greeting/avatar/info (UserHeader)
 * - Habits today: actionable w/ completion
 * - Progress snapshot card
 * - Quote of the Day, auto-refresh
 * - Calendar with emotion logging and reflections
 * - Navigation shortcuts
 * - Auth/token checks, optimistic UI, fetch-once/session policy
 * - Clear pastel/modern design (see Dashboard.module.css)
 */
function Dashboard() {
  const navigate = useNavigate();

  // State: User, habits, progress, quote, emotions, calendar
  const [user, setUser] = useState(null);
  const [habitsToday, setHabitsToday] = useState([]);
  const [progress, setProgress] = useState(null);
  const [quote, setQuote] = useState(null);
  const [emotionData, setEmotionData] = useState([]);
  const [calendarReflections, setCalendarReflections] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [habitsLoading, setHabitsLoading] = useState(false);

  // Fetch all data on first load (fetch-once/session)
  const fetchDashboardData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // 1. Verify Authentication
      const authResp = await fetchWithAuth(`${API_BASE}/auth-status`);
      if (authResp.status !== 200) throw new Error("Not authenticated");
      const { user: userObj } = await authResp.json();
      setUser(userObj);

      // 2. Habits for today
      const habitsResp = await fetchWithAuth(`${API_BASE}/habits/today`);
      const habitsList = await habitsResp.json();
      setHabitsToday(habitsList);

      // 3. Progress snapshot
      const progResp = await fetchWithAuth(`${API_BASE}/progress/snapshot`);
      setProgress(await progResp.json());

      // 4. Quote of the Day
      const quoteResp = await fetchWithAuth(`${API_BASE}/quote`);
      setQuote(await quoteResp.json());

      // 5. Emotions for calendar (mini view: last 2 weeks)
      const emoResp = await fetchWithAuth(`${API_BASE}/emotions/recent`);
      setEmotionData(await emoResp.json());

      // 6. Calendar - reflections/notes for last month (for tooltip)
      const reflectResp = await fetchWithAuth(`${API_BASE}/reflections/recent`);
      setCalendarReflections(await reflectResp.json());

      setLoading(false);
    } catch (e) {
      setError(String(e));
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  // Handler: log out
  function handleLogout() {
    fetchWithAuth(`${API_BASE}/logout`, { method: "POST" }).then(() => {
      navigate("/login");
    });
  }

  // Handler: Complete habit
  async function handleCompleteHabit(habitId) {
    setHabitsLoading(true);
    try {
      const resp = await fetchWithAuth(`${API_BASE}/habits/complete`, {
        method: "POST",
        body: JSON.stringify({ habit_id: habitId }),
      });
      if (resp.ok) {
        // Optimistic update: Mark completed
        setHabitsToday((prev) =>
          prev.map((h) =>
            h.id === habitId ? { ...h, completed: true } : h
          )
        );
        // Soft re-fetch progress and emotions with snapshot batching
        setProgress(await (await fetchWithAuth(`${API_BASE}/progress/snapshot`)).json());
        setEmotionData(await (await fetchWithAuth(`${API_BASE}/emotions/recent`)).json());
      }
    } catch {}
    setHabitsLoading(false);
  }

  // Handler: Emotion log (from CalendarWithEmotions)
  async function handleLogEmotion(date, emotion, notes) {
    // Store in backend, then refetch
    await fetchWithAuth(`${API_BASE}/emotions/log`, {
      method: "POST",
      body: JSON.stringify({ date, emotion, notes }),
    });
    setEmotionData(await (await fetchWithAuth(`${API_BASE}/emotions/recent`)).json());
  }

  // Handler: Refresh Quote of Day
  async function handleRefreshQuote() {
    setQuote(null);
    const quoteResp = await fetchWithAuth(`${API_BASE}/quote/refresh`, { method: "POST" });
    setQuote(await quoteResp.json());
  }

  // Navigation shortcuts
  const shortcuts = [
    { label: "New Habit", icon: "➕", to: "/dashboard/new-habit" },
    { label: "All Habits", icon: "📋", to: "/dashboard/habits" },
    { label: "Progress", icon: "📊", to: "/dashboard/progress" },
    { label: "Profile", icon: "👤", to: "/dashboard/profile" },
    { label: "Settings", icon: "⚙️", to: "/dashboard/settings" },
  ];

  if (loading)
    return (
      <div className="dashboard-root" style={{ padding: 40, textAlign: "center" }}>
        <div className="dashboard-loader" />
        Loading your dashboard...
      </div>
    );
  if (error)
    return (
      <div className="dashboard-root" style={{ color: "#f55", padding: 40 }}>
        {error}
        <br />
        <button onClick={fetchDashboardData}>Retry</button>
      </div>
    );

  return (
    <div className="dashboard-root">
      {/* 1. Header */}
      <UserHeader user={user} onLogout={handleLogout} />

      <div className="dashboard-section-grid">
        {/* 2. Quote of the Day */}
        <QuoteOfTheDayWidget
          quote={quote}
          onRefresh={handleRefreshQuote}
        />

        {/* 3. Progress snapshot */}
        <ProgressSnapshotWidget progress={progress} />

        {/* 4. Habits Today */}
        <HabitsToday
          habits={habitsToday}
          onComplete={handleCompleteHabit}
          loading={habitsLoading}
        />

        {/* 5. Mini calendar + emotions + reflections */}
        <MiniCalendarWidget>
          <CalendarWithEmotions
            emotionData={emotionData}
            reflections={calendarReflections}
            onLogEmotion={handleLogEmotion}
          />
        </MiniCalendarWidget>

        {/* 6. Navigation shortcuts */}
        <DashboardShortcuts shortcuts={shortcuts} navigate={navigate} />
      </div>
    </div>
  );
}

// ----------------- Habits Today Component -----------------

/**
 * PUBLIC_INTERFACE
 * Shows actionable habits for today (list with icons, completion, streak)
 */
function HabitsToday({ habits, onComplete, loading }) {
  return (
    <section className="dashboard-card habits-today">
      <div className="dashboard-card-title">Today's Habits</div>
      {habits.length === 0 ? (
        <div style={{ color: "#aaa", fontSize: 16 }}>No habits assigned for today. 🎉</div>
      ) : (
        <div className="habits-today-list">
          {habits.map((habit) => (
            <div key={habit.id} className="habit-item">
              <span className="habit-icon">{habit.icon || "💡"}</span>
              <span className="habit-title">
                {habit.name}
                <span className="habit-streak">
                  🔥 {habit.streak || 0}
                </span>
              </span>
              <button
                className="habit-complete-btn"
                disabled={habit.completed || loading}
                onClick={() => onComplete(habit.id)}
              >
                {habit.completed ? (
                  <span role="img" aria-label="Done" style={{ color: "#4CDB75" }}>
                    ✔️
                  </span>
                ) : (
                  "Complete"
                )}
              </button>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

// ----------------- Navigation Shortcuts Component -----------------
/**
 * PUBLIC_INTERFACE
 * Compact dashboard navigation grid for quick access.
 */
function DashboardShortcuts({ shortcuts, navigate }) {
  return (
    <section className="dashboard-card dashboard-shortcuts">
      <div className="dashboard-shortcuts-row">
        {shortcuts.map((shortcut) => (
          <button
            key={shortcut.to}
            className="dashboard-shortcut-btn"
            onClick={() => navigate(shortcut.to)}
          >
            <span className="dashboard-shortcut-icon">{shortcut.icon}</span>
            {shortcut.label}
          </button>
        ))}
      </div>
    </section>
  );
}

export default Dashboard;
