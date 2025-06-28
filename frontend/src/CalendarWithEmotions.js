import React, { useState } from "react";

/**
 * PUBLIC_INTERFACE
 * CalendarWithEmotions
 * Displays a monthly calendar with emotion markers for each date.
 * - Shows current selected month/year in header with previous/next navigation buttons.
 * - Only days of the selected month are rendered (no overflow days).
 * - Buttons and layout are styled to match dashboard theme and be responsive.
 * - On small screens, calendar layout adapts for clarity.
 * 
 * @param {Object} props
 * @param {Object} [props.emotionData] - Optional object of emotion per 'YYYY-MM-DD'. E.g. {"2024-06-28": "happy"}
 * @param {Function} [props.onDateClick] - Optional callback(date: Date, iso: string)
 */
const monthNames = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

// Soft pastel color mapping for different emotions
const EMOTION_COLOR_MAP = {
  happy: "#47DB7F",
  sad: "#9DB9F7",
  neutral: "#FFD67E",
  angry: "#F77C7C",
  stressed: "#ECC7FF",
  excited: "#53A9F5",
  default: "#D9E7F6",
};

function pad(num) {
  return num < 10 ? "0" + num : "" + num;
}

function getMonthMatrix(year, monthIdx) {
  // Returns a flat array of date objects for this month's days, from 1st to last day only
  const daysInMonth = new Date(year, monthIdx + 1, 0).getDate();
  const result = [];
  for (let d = 1; d <= daysInMonth; ++d) {
    result.push(new Date(year, monthIdx, d));
  }
  return result;
}

function getTodayISO() {
  const now = new Date();
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
}

function CalendarWithEmotions({ emotionData = {}, onDateClick }) {
  // date context: always at start of selected month
  const [selected, setSelected] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });

  const year = selected.getFullYear();
  const month = selected.getMonth();
  const todayISO = getTodayISO();

  // Generate all dates in this month
  const days = getMonthMatrix(year, month);

  // Weekday names for grid header (start from Sunday)
  const weekdayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  // The weekday index of the first day of the month (0=Sun)
  const firstDayIdx = new Date(year, month, 1).getDay();

  // For grid alignment, number of blank cells before 1st:
  const blanksAtStart = Array(firstDayIdx).fill(null);

  // Handler for previous and next month navigation
  function goToPrevMonth() {
    setSelected(prev => {
      const m = prev.getMonth() === 0 ? 11 : prev.getMonth() - 1;
      const y = prev.getMonth() === 0 ? prev.getFullYear() - 1 : prev.getFullYear();
      return new Date(y, m, 1);
    });
  }

  function goToNextMonth() {
    setSelected(prev => {
      const m = prev.getMonth() === 11 ? 0 : prev.getMonth() + 1;
      const y = prev.getMonth() === 11 ? prev.getFullYear() + 1 : prev.getFullYear();
      return new Date(y, m, 1);
    });
  }

  return (
    <section
      style={{
        width: "100%",
        maxWidth: 440,
        background: "#fff",
        borderRadius: 16,
        boxShadow: "0 2px 13px rgba(120,100,210,.11)",
        padding: "1.1rem 1.2rem 1rem 1.2rem",
        margin: "0 auto",
        boxSizing: "border-box",
        fontFamily: '"Helvetica Neue", Arial, sans-serif',
      }}
    >
      {/* Calendar month/year header with navigation */}
      <header
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 8,
          gap: 15,
        }}
      >
        <button
          type="button"
          aria-label="Previous month"
          tabIndex={0}
          onClick={goToPrevMonth}
          style={{
            background: "none",
            border: "none",
            fontSize: 18,
            color: "var(--ht-primary,#6A51CF)",
            cursor: "pointer",
            borderRadius: "50%",
            width: 32,
            height: 32,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "background .11s",
          }}
          onMouseOver={e => e.currentTarget.style.background = "#F7F7FB"}
          onMouseOut={e => e.currentTarget.style.background = "none"}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" style={{display:"block"}}>
            <path d="M15.25 18.25 9.75 12.75 15.25 7.25" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <div
          style={{
            flex: "none",
            fontWeight: 700,
            color: "#37296A",
            fontSize: "1.15rem",
            letterSpacing: 0.01,
            textAlign: "center",
            minWidth: 110,
            margin: "0 4px",
            userSelect: "none",
          }}
        >
          {monthNames[month]} {year}
        </div>
        <button
          type="button"
          aria-label="Next month"
          tabIndex={0}
          onClick={goToNextMonth}
          style={{
            background: "none",
            border: "none",
            fontSize: 18,
            color: "var(--ht-primary,#6A51CF)",
            cursor: "pointer",
            borderRadius: "50%",
            width: 32,
            height: 32,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "background .11s",
          }}
          onMouseOver={e => e.currentTarget.style.background = "#F7F7FB"}
          onMouseOut={e => e.currentTarget.style.background = "none"}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" style={{display:"block"}}>
            <path d="M8.75 18.25 14.25 12.75 8.75 7.25" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </header>
      {/* Calendar weekday labels */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(7, 1fr)",
          gap: "0.2rem",
          marginBottom: 4,
        }}
      >
        {weekdayNames.map((wd, i) => (
          <div
            key={wd}
            style={{
              color: "#A39EB9",
              fontWeight: 600,
              fontSize: 13.2,
              textAlign: "center",
              padding: "3px 0",
              letterSpacing: 0.03,
              userSelect: "none",
            }}
          >
            {wd}
          </div>
        ))}
      </div>
      {/* Calendar grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(7, 1fr)",
          gap: "0.27rem",
          minHeight: 210,
          marginBottom: 8,
          alignItems: "stretch",
        }}
      >
        {/* Blank cells for alignment (start at correct weekday) */}
        {blanksAtStart.map((_, idx) => (
          <div key={"blank" + idx} />
        ))}
        {/* Only current month's days */}
        {days.map(dateObj => {
          const d = dateObj.getDate();
          const dateISO = `${year}-${pad(month + 1)}-${pad(d)}`;
          const isToday = dateISO === todayISO;
          const hasEmotion = emotionData && emotionData[dateISO];
          const emotion = hasEmotion ? emotionData[dateISO] : null;
          const dotColor = emotion ? (EMOTION_COLOR_MAP[emotion] || EMOTION_COLOR_MAP.default) : null;
          return (
            <button
              key={dateISO}
              aria-label={`Day ${d}` + (emotion ? `, feeling ${emotion}` : "")}
              onClick={() => onDateClick && onDateClick(dateObj, dateISO)}
              style={{
                // Responsive sizing, min cell size
                aspectRatio: "1",
                width: "100%",
                minWidth: 0,
                minHeight: 32,
                maxWidth: 44,
                background: isToday
                  ? "linear-gradient(90deg,#F9EBFF 65%,#DCFAF5 100%)"
                  : "rgba(249,249,252,0.94)",
                border: "none",
                outline: isToday ? "2.3px solid #6951C7" : "none",
                borderRadius: 13,
                margin: 0,
                padding: "0.27rem 0 0.23rem 0",
                fontSize: 15.2,
                fontWeight: 500,
                color: "#483795",
                cursor: onDateClick ? "pointer" : "default",
                position: "relative",
                boxShadow: isToday ? "0 2px 9px rgba(140,119,217,.12)" : "none",
                transition: "background .13s, outline .13s",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
              }}
              tabIndex={0}
            >
              <span>{d}</span>
              {/* Emotion dot, if present */}
              {emotion ? (
                <span
                  style={{
                    width: 8,
                    height: 8,
                    background: dotColor,
                    borderRadius: "50%",
                    display: "inline-block",
                    marginTop: 2,
                    border: "1.3px solid #fff",
                    boxShadow: "0 0 2px #bcbbdc",
                  }}
                />
              ) : null}
            </button>
          );
        })}
      </div>
      {/* Optional: small legend if emotions shown */}
      {emotionData && Object.values(emotionData).filter(Boolean).length > 0 && (
        <div style={{
          marginTop: 1,
          display: "flex",
          gap: 8,
          flexWrap: "wrap",
          fontSize: 12.5,
          justifyContent: "center"
        }}>
          {Object.entries(EMOTION_COLOR_MAP).filter(([k]) => k !== "default").map(([emo, color]) => (
            <span key={emo} style={{display: "flex", alignItems: "center", gap: 3, marginRight: 7}}>
              <span style={{
                width: 10, height: 10, borderRadius: "50%", background: color,
                display: "inline-block", border: "1px solid #E5E5EC", marginRight: 2
              }}/>
              <span style={{color:"#A39EB9"}}>{emo.charAt(0).toUpperCase() + emo.slice(1)}</span>
            </span>
          ))}
        </div>
      )}
    </section>
  );
}

export default CalendarWithEmotions;
