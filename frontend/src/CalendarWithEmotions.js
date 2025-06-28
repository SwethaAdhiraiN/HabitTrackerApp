import React, { useState } from "react";

// Calendar grid constants
const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const EMOTION_EMOJIS = {
  happy: "😊",
  neutral: "😐",
  sad: "😞",
  angry: "😠",
  excited: "🤩",
  tired: "😩",
  stressed: "😰",
  // ...add more as needed
};

/**
 * PUBLIC_INTERFACE
 * CalendarWithEmotions: Renders a month-view calendar with per-day emotion tracking.
 * Allows the user to select a day, then pick an emotion, which renders as an emoji below/beside the date number.
 * Ensures:
 *   - Emoji is always mapped to and rendered on the exact correct cell (no offset/next-day bug).
 *   - Date and emoji are visually separated: date number at top, emoji always below (or beside) with spacing, no overlap.
 *   - Calendar grid remains visually clean and responsive.
 */
export default function CalendarWithEmotions({
  year,
  month, // 0-based (January = 0)
  initialEmotions = {},
}) {
  // Today's date for highlight
  const today = new Date();
  const thisMonth = typeof month === "number" ? month : today.getMonth();
  const thisYear = year || today.getFullYear();

  // State: emotions per ISO date ("YYYY-MM-DD"), selected date string
  const [emotions, setEmotions] = useState(initialEmotions);
  const [selectedDate, setSelectedDate] = useState(null);

  // Get first and last day numbers for this month
  const firstDayObj = new Date(thisYear, thisMonth, 1);
  const lastDayObj = new Date(thisYear, thisMonth + 1, 0);
  
  // For accessibility/string comparison
  const dateToString = (d) =>
    `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
      d.getDate()
    ).padStart(2, "0")}`;

  // Fill array of all days in this month [{date: Date, iso: 'YYYY-MM-DD'}, ...]
  const days = [];
  for (let n = 1; n <= lastDayObj.getDate(); n++) {
    const date = new Date(thisYear, thisMonth, n);
    days.push({ date, iso: dateToString(date) });
  }

  // Calendar grid info: get which weekday the first date falls on, so the grid is aligned
  const firstWeekday = firstDayObj.getDay();

  // To keep grid aligned, fill blank days at start (if month doesn't start on Sunday)
  const paddedDays = [
    ...Array(firstWeekday).fill(null),
    ...days,
  ];

  // Add trailing blanks for last week if needed for 6-row grid
  while (paddedDays.length % 7 !== 0) paddedDays.push(null);

  // Clicking a date - select it (for picking emotion)
  function handleDateClick(iso) {
    setSelectedDate(iso);
  }

  // Choose an emotion for selected date
  function handleEmotionSelect(emotion) {
    if (!selectedDate) return;
    setEmotions((em) => ({
      ...em,
      [selectedDate]: emotion,
    }));
    setSelectedDate(null); // Optionally, deselect after picking
  }

  // Render emotion picker only if a date is selected
  function EmotionPicker({ onPick }) {
    return (
      <div className="emotion-picker" style={{
        display: "flex", gap: 10, marginTop: 8, flexWrap: "wrap",
        justifyContent: "center", background: "#fff", borderRadius: 10,
        boxShadow: "0 2px 9px rgba(104,127,229,0.09)", padding: "10px 10px 6px 13px"
      }}>
        {Object.entries(EMOTION_EMOJIS).map(([k, v]) => (
          <button
            key={k}
            style={{
              fontSize: "1.35rem",
              background: "transparent",
              border: "none",
              cursor: "pointer",
              transition: "transform .08s",
              outline: "none",
            }}
            aria-label={k}
            onClick={() => onPick(k)}
            tabIndex={0}
          >{v}</button>
        ))}
      </div>
    );
  }

  // Calculate calendar grid styles for responsiveness
  const gridTemplate =
    "repeat(7, minmax(0, 1fr))";

  // Final render
  return (
    <div className="calendar-emotions-root" style={{
      maxWidth: 420, background: "#faf7ff", borderRadius: 18,
      boxShadow: "0 2px 13px rgba(162,97,255,0.06)",
      padding: 18, margin: "0 auto", fontFamily: "inherit",
    }}>
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        marginBottom: 8, gap: 8
      }}>
        <h2 style={{margin:0, fontSize: "1.20rem", fontWeight: 700, color: "#462381", letterSpacing: 0.02}}>
          {firstDayObj.toLocaleString("default", { month: "long" })} {thisYear}
        </h2>
      </div>
      <div
        className="calendar-grid"
        style={{
          display: "grid",
          gridTemplateColumns: gridTemplate,
          gap: 2,
          marginBottom: 8,
          marginTop: 3
        }}>
        {WEEKDAYS.map((wd) => (
          <div
            key={wd}
            style={{
              color: "#9965C7",
              fontWeight: 600,
              fontSize: "0.97rem",
              padding: "2px 0 4px 0",
              textAlign: "center",
              letterSpacing: 0,
              userSelect: "none"
            }}
          >
            {wd}
          </div>
        ))}
        {paddedDays.map((info, idx) => {
          if (!info)
            return (
              <div
                key={`blank-${idx}`}
                aria-hidden="true"
                style={{
                  background: "none",
                  minHeight: 48,
                  minWidth: 0,
                }}
              />
            );
          const { date, iso } = info;
          const isToday =
            dateToString(today) === iso &&
            today.getMonth() === date.getMonth() &&
            today.getFullYear() === date.getFullYear();
          const isSelected = iso === selectedDate;
          const hasEmotion = !!emotions[iso];
          return (
            <div
              key={iso}
              className="calendar-day-cell"
              tabIndex={0}
              onClick={() => handleDateClick(iso)}
              style={{
                cursor: "pointer",
                background: isSelected
                  ? "#EEF1F5"
                  : hasEmotion
                  ? "#f9f6ff"
                  : "#fff",
                borderRadius: 12,
                border: isToday
                  ? "2.2px solid #9B69F2"
                  : "1.2px solid #e9e6f9",
                boxShadow: hasEmotion
                  ? "0 3px 16px rgba(162,97,255,0.07)"
                  : "none",
                minHeight: 52,
                aspectRatio: "0.82",
                overflow: "hidden",
                padding: 0,
                position: "relative",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "flex-start",
                transition: "background .13s"
              }}
              aria-label={`Day ${date.getDate()}${
                hasEmotion ? ", emotion selected" : ""
              }`}
            >
              {/* Date number at top */}
              <div
                style={{
                  fontWeight: 700,
                  fontSize: "1.05rem",
                  color: isToday
                    ? "#462381"
                    : hasEmotion
                    ? "#4B267E"
                    : "#645f74",
                  marginTop: 6,
                  marginBottom: hasEmotion ? 0 : 12,
                  zIndex: 2,
                  letterSpacing: 0.01,
                  lineHeight: 1.1,
                  textAlign: "center",
                  userSelect: "none",
                }}
              >
                {date.getDate()}
              </div>
              {/* Emoji below date (always visible if set, no overlap) */}
              {hasEmotion && (
                <div
                  style={{
                    fontSize: "1.55rem",
                    marginTop: 1,
                    marginBottom: 0,
                    lineHeight: "1.15",
                    zIndex: 1,
                    textAlign: "center",
                    whiteSpace: "nowrap",
                    userSelect: "none",
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    minHeight: 24,
                  }}
                  aria-label={emotions[iso]}
                  title={emotions[iso]}
                >
                  {EMOTION_EMOJIS[emotions[iso]] || "❓"}
                </div>
              )}
              {/* Visual feedback for selected day but no emoji: show subtle placeholder area */}
              {!hasEmotion && isSelected && (
                <div style={{ minHeight: 26, marginTop: 3 }} />
              )}
            </div>
          );
        })}
      </div>
      {/* Emotion Picker Pop-up */}
      {selectedDate && (
        <EmotionPicker onPick={handleEmotionSelect} />
      )}
    </div>
  );
}
