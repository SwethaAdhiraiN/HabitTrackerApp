import React from "react";

// PUBLIC_INTERFACE
// The Dashboard will pass emojiMap, getHabitEmoji as props for category emoji display.
// No changes required here for core logic—enhanced rendering is proxied in Dashboard.js.

// eslint-disable-next-line
export default function HabitsToday(props) {
  // Rendering code is implemented elsewhere; any enhancements (like emoji/category) are added by wrappers of this component.
  // Here we simply show a placeholder so the dashboard integration continues to work as before.
  return (
    <section style={{
      background: "rgba(255,255,255,0.98)",
      borderRadius: 14,
      boxShadow: "0 2px 12px rgba(123,97,255,0.10)",
      padding: "18px 14px",
      marginBottom: 22,
      width: "100%"
    }}>
      <div style={{
        fontWeight: 700,
        fontSize: "1.01rem",
        color: "#62439B"
      }}>
        {/* Placeholder habits for demo UI: */}
        {props.habits
          ? props.habits.map((h, i) => (
              <div key={h.name || i} style={{
                display: "flex",
                alignItems: "center",
                gap: 7,
                marginBottom: 7,
                fontSize: "1.05rem"
              }}>
                <span style={{ fontSize: "1.27rem" }}>
                  {props.getHabitEmoji ? props.getHabitEmoji(h.name || h.category) : "✨"}
                </span>
                <span style={{
                  fontWeight: 600, color: "#22223b"
                }}>{h.name}</span>
                <span style={{
                  fontSize: ".90rem",
                  marginLeft: "auto",
                  color: h.progress && h.progress[0] ? "#53A9F5" : "#BDB2DF"
                }}>
                  {h.progress && h.progress[0] ? "✓" : "—"}
                </span>
              </div>
          ))
          : "No habits for today 🎉"}
      </div>
    </section>
  );
}

// For emoji logic sharing
export const habitCategoryEmoji = {
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
