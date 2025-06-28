import React, { useEffect, useState } from "react";
import UserHeader from "./UserHeader";
import ProgressSnapshotWidget from "./ProgressSnapshotWidget";
import MiniCalendarWidget from "./MiniCalendarWidget";
import QuoteOfTheDayWidget from "./QuoteOfTheDayWidget";
import "./styles/Dashboard.module.css";

// Decorative pastel banner (SVG illustration holder)
function DecorativeBanner({ variant = "top" }) {
  if (variant === "top") {
    return (
      <div
        className="decor-banner-top"
        style={{
          height: 58,
          width: "100%",
          marginBottom: 18,
          marginTop: -24,
          position: "relative",
          overflow: "hidden",
          background: "linear-gradient(90deg, #FCE7F3 0%, #EFE4FA 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <svg viewBox="0 0 400 58" style={{ width: "100%", height: "100%", display: "block" }}>
          <ellipse cx="200" cy="30" rx="170" ry="22" fill="#EBD6FB" opacity="0.5" />
          <ellipse cx="75" cy="50" rx="56" ry="12" fill="#F7A1B2" opacity="0.23" />
          <ellipse cx="320" cy="38" rx="60" ry="10" fill="#C48DDC" opacity="0.20" />
        </svg>
      </div>
    );
  }
  return null;
}

// Map category/keyword to emoji or icon (expand as needed)
const habitCategoryEmoji = {
  mindfulness: "🧘‍♀️",
  meditation: "🧘‍♂️",
  meditate: "🧘‍♀️",
  hydration: "💧",
  water: "💧",
  read: "📚",
  reading: "📚",
  movement: "🏃‍♂️",
  exercise: "🏃‍♂️",
  workout: "🏋️‍♂️",
  journaling: "📔",
  sleep: "😴",
  gratitude: "🌼",
  learning: "🎓",
  study: "✏️",
  healthyEating: "🥦",
  walk: "🚶",
  floss: "🦷",
  yoga: "🧘",
  cleaning: "🧹",
  mood: "😌",
  relax: "🌿",
};

// PUBLIC_INTERFACE
export function getHabitEmoji(habitNameOrCategory) {
  if (!habitNameOrCategory) return "✨";
  const str = habitNameOrCategory.toLowerCase();
  for (let key in habitCategoryEmoji) {
    if (str.includes(key)) return habitCategoryEmoji[key];
  }
  return "✨";
}

function StreakBoard({ habit }) {
  const today = new Date();
  let history = habit.streakHistory || [1, 2, 1, 3, 0, 5, 6, 7, 6, 8, 7, 10];
  if (history.length > 14) history = history.slice(-14);
  else history = [...Array(14 - history.length).fill(0), ...history];
  const maxVal = Math.max(7, ...history);

  return (
    <div
      className="streak-board"
      style={{
        background: "linear-gradient(180deg, #FCE7F3 10%, #F6F3FB 90%)",
        borderRadius: "14px",
        padding: "18px 16px 14px 16px",
        margin: "10px 0 18px 0",
        boxShadow: "0 2px 13px rgba(138,117,217,0.09)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        minWidth: 0,
      }}
    >
      <div
        style={{
          fontWeight: 700,
          fontSize: "1rem",
          color: "#62439B",
          display: "flex",
          alignItems: "center",
          gap: 8,
          marginBottom: 9,
          letterSpacing: 0,
        }}
      >
        <span style={{ fontSize: "1.32rem", marginRight: 3 }}>{getHabitEmoji(habit.name || habit.category)}</span>
        {habit.name}
      </div>
      <div
        style={{
          fontSize: "0.96rem",
          color: "#46466E",
          fontWeight: 600,
          marginBottom: 4,
          letterSpacing: 0.1,
        }}
      >
        Current Streak:{" "}
        <span
          style={{
            color: "#C48DDC",
            background: "#EFE4FA",
            borderRadius: 8,
            marginLeft: 5,
            padding: "1.5px 9px",
            fontWeight: 700,
          }}
        >
          {habit.currentStreak || habit.streak || 0} days
        </span>
      </div>
      <div
        style={{
          width: "100%",
          height: 34,
          display: "flex",
          alignItems: "end",
          gap: 2,
          marginTop: 5,
          marginBottom: 0,
        }}
      >
        {history.map((val, i) => (
          <div
            key={i}
            style={{
              width: 8,
              height: `${8 + 20 * (val / (maxVal || 1))}px`,
              background: val === maxVal ? "#53A9F5" : "#C48DDC",
              opacity: val > 0 ? 0.85 : 0.19,
              borderRadius: 6,
              marginRight: i === history.length - 1 ? 0 : 1,
              transition: "height 0.32s",
            }}
          />
        ))}
      </div>
      <div style={{ marginTop: 4, fontSize: "0.9rem", color: "#747497", opacity: 0.8 }} aria-label="streak chart explanation">
        <span style={{ fontWeight: 400 }}>Last 2 weeks</span>
      </div>
    </div>
  );
}

function TrendChartWidget({ data }) {
  const chartData =
    data && data.length > 0
      ? data
      : [
          { date: "2024-06-01", completeCount: 1, total: 2 },
          { date: "2024-06-02", completeCount: 2, total: 2 },
          { date: "2024-06-03", completeCount: 1, total: 3 },
          { date: "2024-06-04", completeCount: 3, total: 3 },
          { date: "2024-06-05", completeCount: 2, total: 3 },
          { date: "2024-06-06", completeCount: 3, total: 3 },
          { date: "2024-06-07", completeCount: 2, total: 3 },
        ];

  const maxY = 100;
  const width = Math.max(chartData.length * 38, 256);
  const height = 74;
  const barWidth = 16;
  const margin = { l: 30, r: 12, t: 10, b: 20 };

  const percents = chartData.map((d) =>
    d.total ? Math.round((d.completeCount / d.total) * 100) : 0
  );

  return (
    <div
      className="trend-chart-widget"
      style={{
        width: "100%",
        background: "linear-gradient(90deg, #EBD6FB 30%, #EEF1F5 95%)",
        borderRadius: "16px",
        boxShadow: "0 2px 12px rgba(123,97,255,0.10)",
        padding: "18px 12px 12px 12px",
        margin: "16px 0 14px 0",
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
      }}
    >
      <div
        style={{
          fontWeight: 700,
          color: "#62439B",
          fontSize: "1.08rem",
          marginBottom: 6,
          marginLeft: 2,
          letterSpacing: 0,
          display: "flex",
          alignItems: "center",
          gap: 7,
        }}
      >
        <span>📊</span> Habit Completion Trend
      </div>
      <div style={{ width: "100%", overflowX: "auto", paddingBottom: 4 }}>
        <svg
          width={width + margin.l + margin.r}
          height={height + margin.t + margin.b}
          style={{ maxWidth: "100%" }}
        >
          <line
            x1={margin.l}
            y1={height + margin.t}
            x2={width + margin.l}
            y2={height + margin.t}
            stroke="#ddd"
            strokeWidth="1"
          />
          {percents.map((p, i) => (
            <rect
              key={i}
              x={margin.l + i * 38}
              y={height + margin.t - height * (p / maxY)}
              width={barWidth}
              height={height * (p / maxY)}
              rx={5}
              fill="#53A9F5"
              opacity={0.38 + 0.23 * (p / 100)}
            />
          ))}
          <polyline
            fill="none"
            stroke="#C48DDC"
            strokeWidth="2.7"
            points={percents
              .map(
                (p, i) =>
                  `${margin.l + i * 38 + barWidth / 2},${height +
                    margin.t -
                    height * (p / maxY)}`
              )
              .join(" ")}
            style={{ filter: "drop-shadow(0 0.5px 3px #f7a1b240)" }}
          />
          {percents.map((p, i) => (
            <circle
              key={i}
              cx={margin.l + i * 38 + barWidth / 2}
              cy={height + margin.t - height * (p / maxY)}
              r="4"
              fill="#F7A1B2"
            />
          ))}
          {chartData.map((d, i) => (
            <text
              key={i}
              x={margin.l + i * 38 + barWidth / 2}
              y={height + margin.t + 15}
              textAnchor="middle"
              fontSize="10"
              fill="#978ABD"
              style={{ fontFamily: "inherit" }}
            >
              {d.date.slice(5)}
            </text>
          ))}
        </svg>
      </div>
    </div>
  );
}

// HabitsToday with emoji enhancement.
import HabitsTodayOriginal from "./HabitsToday";
function EnhancedHabitsToday(props) {
  return (
    <div>
      <div style={{ width: "100%", marginBottom: 10 }}>
        <span
          style={{
            fontSize: "1.325rem",
            fontWeight: 700,
            color: "#62439B",
            display: "inline-flex",
            alignItems: "center",
            gap: 10,
            letterSpacing: 0,
            background: "rgba(253,240,253,0.7)",
            padding: "6px 18px 6px 13px",
            borderRadius: 13,
            boxShadow: "0 1px 6px #ebd5fa22",
          }}
        >
          <span>🗓️</span> Today's habits
        </span>
      </div>
      <HabitsTodayOriginal {...props} emojiMap={habitCategoryEmoji} getHabitEmoji={getHabitEmoji} />
    </div>
  );
}

function Dashboard() {
  // Load authenticated user from session/localStorage. If not present, show loading/blank.
  const [user, setUser] = useState(null);
  const [habits, setHabits] = useState(null);
  const [completionTrend, setCompletionTrend] = useState(null);

  // Example: Optionally, track loading state for habits, trend, etc.
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Try to load authenticated user from sessionStorage/localStorage
    let storedUser = null;
    try {
      storedUser =
        JSON.parse(window.sessionStorage.getItem("habit_user")) ||
        JSON.parse(window.localStorage.getItem("habit_user"));
    } catch { /* ignore */ }

    if (storedUser && storedUser.id) {
      setUser(storedUser);
      setLoading(true);

      // Fetch user habits and habit completion trend (replace with actual API)
      fetch(`/api/habits?user_id=${storedUser.id}`)
        .then((resp) => (resp.ok ? resp.json() : Promise.reject(resp)))
        .then((data) => {
          setHabits(
            Array.isArray(data.habits)
              ? data.habits.map((h) => ({
                  // Adapt habit fields if needed for display
                  name: h.name,
                  category: h.icon || h.category || "",
                  streak: h.streak,
                  streakHistory: h.streakHistory || [], // If your backend supports streak history
                  progress: h.days || [],
                  ...h
                }))
              : []
          );
        })
        .catch(() => setHabits([]));

      // For completion trend: requires separate API, you can set null or basic structure for now.
      // Your app may need to fetch from /api/progress?user_id=... (implement as you expand)
      // Here we set a blank array to avoid static data.
      setCompletionTrend([]);
      setLoading(false);
    } else {
      setUser(null);
      setHabits(null);
      setCompletionTrend(null);
      setLoading(false);
    }
  }, []);

  // Logout handler: clears storage and refreshes to login/landing
  const handleLogout = () => {
    window.sessionStorage.removeItem("habit_user");
    window.localStorage.removeItem("habit_user");
    setUser(null);
    // Optionally, redirect to login/home
    window.location.href = "/login";
  };

  // UI: only show sections if real/fetched user and data loaded
  return (
    <div className="dashboard-root">
      <DecorativeBanner variant="top" />
      <UserHeader user={user} onLogout={handleLogout} />
      <main className="dashboard-main">
        <div className="dashboard-main-content">
          {!user && (
            <div style={{ color: "#aaa", fontSize: "1.1em", marginTop: 40, textAlign: "center" }}>
              {loading ? "Loading user data..." : "No user session found."}
            </div>
          )}

          {user && (
            <>
              {/* Habits Today: blank or loading if habits not loaded */}
              {habits === null ? (
                <div style={{ color: "#aaa", margin: "18px 0" }}>Loading your habits…</div>
              ) : habits.length === 0 ? (
                <div style={{ color: "#aaa", margin: "18px 0" }}>No habits found—start a new one!</div>
              ) : (
                <EnhancedHabitsToday user={user} habits={habits} />
              )}

              {/* Streak Boards */}
              <div
                style={{
                  marginBottom: 10,
                  marginTop: -8,
                  display: "flex",
                  flexDirection: "column",
                  gap: 0,
                  width: "100%",
                }}
              >
                {habits && habits.length > 0
                  ? habits.map((habit, idx) => (
                      <StreakBoard key={habit.name || habit.id || idx} habit={habit} />
                    ))
                  : null}
              </div>
              <div style={{ margin: "0 0 18px 0" }}>
                <svg
                  width="180"
                  height="16"
                  viewBox="0 0 180 16"
                  style={{
                    width: "80%",
                    maxWidth: 220,
                    minHeight: 10,
                    display: "block",
                    margin: "8px auto",
                  }}
                >
                  <ellipse cx="70" cy="10" rx="56" ry="5" fill="#F7A1B2" opacity="0.21" />
                  <ellipse cx="120" cy="8" rx="20" ry="3" fill="#C48DDC" opacity="0.17" />
                </svg>
              </div>
              {/* Completion Trend Chart: if not available yet, show empty or loading */}
              <TrendChartWidget data={completionTrend || []} />
              {/* Progress Snapshot, MiniCalendar, and Quote widgets—pass dynamic user, blank/placeholder for now */}
              <ProgressSnapshotWidget user={user} />
              <MiniCalendarWidget user={user} />
              <QuoteOfTheDayWidget />
            </>
          )}
        </div>
      </main>
    </div>
  );
}

export default Dashboard;
