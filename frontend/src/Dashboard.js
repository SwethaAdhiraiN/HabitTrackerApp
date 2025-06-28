import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import UserHeader from "./UserHeader";
import ProgressSnapshotWidget from "./ProgressSnapshotWidget";
import MiniCalendarWidget from "./MiniCalendarWidget";
import CalendarWithEmotions from "./CalendarWithEmotions";
import QuoteOfTheDayWidget from "./QuoteOfTheDayWidget";
import "./styles/Dashboard.module.css";

/**
 * Helper to get current user from storage, null if absent.
 */
function getSavedUser() {
  try {
    const stored = window.sessionStorage.getItem("habit_user") || window.localStorage.getItem("habit_user");
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
}

// Utilities for API calls
const API_BASE = "/api";

/**
 * fetchWithAuth: Simple fetch wrapper (optionally sends JSON).
 * No server session/cookie/JWT is used; must pass user_id where needed.
 */
async function fetchWithAuth(url, options = {}) {
  return fetch(url, {
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
 * Dashboard: Improved authentication handling for HabitTrackerApp.
 * Reads authentication from storage, passes user_id in all API requests,
 * and redirects to /login if not authenticated.
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

  // Fetch all data on first load
  const fetchDashboardData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // 1. Load user from storage
      let userObj = getSavedUser();
      if (!userObj || !userObj.id) {
        setUser(null);
        setLoading(false);
        navigate("/login");
        return;
      }
      setUser(userObj);

      // 2. Fetch user's habits (use user_id as query param)
      const habitsResp = await fetchWithAuth(`${API_BASE}/habits?user_id=${userObj.id}`);
      const habitsResult = await habitsResp.json();
      if (!habitsResult.success) throw new Error("Failed to load habits: " + (habitsResult.message || "Unknown error"));
      setHabitsToday(habitsResult.habits || []);

      // 3. Progress snapshot (use today's date for current progress)
      // If more detailed stats are desired, a new endpoint would be needed.
      const today = new Date().toISOString().slice(0, 10);
      const progressResp = await fetchWithAuth(`${API_BASE}/progress?user_id=${userObj.id}&date=${today}`);
      const progressResult = await progressResp.json();
      let snap = null;
      if (progressResult.success && progressResult.progress && progressResult.progress.length > 0) {
        // Use the first (should be the only) entry for today
        snap = {
          ...progressResult.progress[0],
          // Augment dummy values for snapshot card if missing
          streak: progressResult.progress[0]?.streak ?? (progressResult.progress[0]?.total_checked > 0 ? 1 : 0),
          completion_rate: (progressResult.progress[0]?.success_rate || 0) * 100,
          total_completed: progressResult.progress[0]?.total_checked ?? 0,
          habits_tracked: progressResult.progress[0]?.total_habits ?? 0,
        };
      }
      setProgress(snap);

      // 4. Quote of the Day
      const quoteResp = await fetchWithAuth(`${API_BASE}/quote`);
      const quoteResult = await quoteResp.json();
      // The API returns {success, quote, author}
      setQuote(quoteResult.success ?
        { quote: quoteResult.quote, author: quoteResult.author } : null);

      // 5. Emotions for the calendar (use backend's demo API)
      // /api/emotion?user_id=N
      const calendarEmoResp = await fetchWithAuth(`${API_BASE}/emotion?user_id=${userObj.id}`);
      const calendarEmoResult = await calendarEmoResp.json();
      let calendarEmoArray = [];
      if (calendarEmoResult.success && calendarEmoResult.emotions) {
        calendarEmoArray = Object.entries(calendarEmoResult.emotions).map(([date, emoji]) =>
          ({ date, emoji, label: "", note: "" })); // label/note unsupported in backend but placeholder here
      }
      setEmotionData(calendarEmoArray);

      // 6. Reflections (not implemented in backend; leave blank)
      setCalendarReflections({});

      setLoading(false);
    } catch (e) {
      setError(String(e));
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    fetchDashboardData();
    // Add a storage event listener (to react to logout from other tabs)
    function onStorage() {
      if (!getSavedUser()) {
        setUser(null);
        navigate("/login");
      }
    }
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [fetchDashboardData, navigate]);

  // Handler: log out (just clears storage and navigates to login)
  function handleLogout() {
    window.sessionStorage.removeItem("habit_user");
    window.localStorage.removeItem("habit_user");
    setUser(null);
    navigate("/login");
  }

  // Handler: Complete habit (simulate as updating progress, backend doesn't have per-habit completion endpoint)
  async function handleCompleteHabit(habitId) {
    setHabitsLoading(true);
    try {
      const userObj = getSavedUser();
      if (!userObj) {
        setHabitsLoading(false);
        navigate("/login");
        return;
      }
      // We'll update today's progress by POSTing to /api/progress, adding the checked habit.
      const today = new Date().toISOString().slice(0, 10);

      // Fetch current progress so we can update it
      const existingProgressResp = await fetchWithAuth(`${API_BASE}/progress?user_id=${userObj.id}&date=${today}`);
      const progressRes = await existingProgressResp.json();
      let habit_checkmarks = {};
      if (progressRes.success && Array.isArray(progressRes.progress) && progressRes.progress.length > 0) {
        habit_checkmarks = { ...progressRes.progress[0].habit_checkmarks };
      }
      habit_checkmarks[habitId] = true;

      // Send update
      await fetchWithAuth(`${API_BASE}/progress`, {
        method: "POST",
        body: JSON.stringify({
          user_id: userObj.id,
          date: today,
          habit_checkmarks
        }),
      });

      // Re-fetch dashboard data (to update habits, progress, emotions)
      await fetchDashboardData();
    } catch {
      // Ignore error for now (can add alert)
    }
    setHabitsLoading(false);
  }

  // Handler: Emotion log (from CalendarWithEmotions)
  async function handleLogEmotion(date, emotion, notes) {
    const userObj = getSavedUser();
    if (!userObj) {
      navigate("/login");
      return;
    }
    // Store emotion using backend API (only emoji supported, notes ignored in backend)
    await fetchWithAuth(`${API_BASE}/emotion`, {
      method: "POST",
      body: JSON.stringify({ user_id: userObj.id, date, emotion }),
    });
    await fetchDashboardData();
  }

  // Handler: Refresh Quote of the Day
  async function handleRefreshQuote() {
    // For demo, just refetch the quote
    setQuote(null);
    const quoteResp = await fetchWithAuth(`${API_BASE}/quote`);
    const quoteResult = await quoteResp.json();
    setQuote(quoteResult.success ?
      { quote: quoteResult.quote, author: quoteResult.author } : null);
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
