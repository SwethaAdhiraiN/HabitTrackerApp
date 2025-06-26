import React, { useEffect, useState } from "react";
import styles from "./styles/Dashboard.module.css";

// PUBLIC_INTERFACE
/**
 * MiniCalendarWidget
 * Dashboard mini widget: shows visual monthly calendar with per-day habit completions for the logged-in user.
 * - Compact by default, can expand to full month view
 * - Fetches completion dates via /api/progress (expects .completed_dates list of date strings: YYYY-MM-DD)
 * - Highlights today, pastel colorizes completion, supports loading/error empty states
 * - Dashboard-conformant styles: soft pastels, rounded cards, subtle compact
 *
 * Props:
 *   - userId (optional): for multi-user dashboards (default: uses session user)
 */
function MiniCalendarWidget({ userId }) {
  // State: completion data, loading, error, expanded
  const [completedDates, setCompletedDates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expanded, setExpanded] = useState(false);
  const today = new Date();

  useEffect(() => {
    let ignore = false;
    setLoading(true);
    setError("");
    // Compose endpoint
    let url = "/api/progress";
    if (userId) url += "?user_id=" + encodeURIComponent(userId);
    fetch(url, {
      method: "GET",
      credentials: "include",
    })
      .then(async (r) => {
        if (!r.ok) throw new Error("Failed to fetch progress");
        const data = await r.json();
        if (!ignore) setCompletedDates(Array.isArray(data.completed_dates) ? data.completed_dates : []);
      })
      .catch((e) => {
        if (!ignore) setError("Could not load progress data");
      })
      .finally(() => {
        if (!ignore) setLoading(false);
      });
    return () => {
      ignore = true;
    };
  }, [userId]);

  // Utility: get YYYY-MM-DD for a date object
  function toISODate(d) {
    return d.toISOString().slice(0, 10);
  }

  // Determine month/year to show (current month, unless expanded allows paging)
  const year = today.getFullYear();
  const month = today.getMonth();

  // Days of week (starts on Sunday; can make Mon start if preferred)
  const weekDays = ["S", "M", "T", "W", "T", "F", "S"];

  // Calendar grid: which day of week 1st is, days in month
  const firstOfMonth = new Date(year, month, 1);
  const lastOfMonth = new Date(year, month + 1, 0);
  const numDays = lastOfMonth.getDate();
  const firstDayIdx = firstOfMonth.getDay();

  // Fill calendar grid, marking completed dates
  const daysArr = [];
  for (let i = 0; i < firstDayIdx; ++i) daysArr.push(null); // Padding before start of month
  for (let d = 1; d <= numDays; d++) {
    daysArr.push(new Date(year, month, d));
  }
  // Pastel palette for completion - soft green, purple, blue, pink, yellow
  const pastelPalette = [
    "#B8F5C5", // green
    "#C7D1F6", // blue
    "#FBE3E6", // pink
    "#F6E6C1", // yellow
    "#EBD6FB", // purple
  ];

  function getDotColor(d) {
    // Simple hash for date => index in palette
    if (!d) return "#fff";
    const code = d.getDate() + d.getMonth() + d.getFullYear();
    return pastelPalette[code % pastelPalette.length];
  }

  function isToday(cellDate) {
    return (
      cellDate &&
      cellDate.getDate() === today.getDate() &&
      cellDate.getMonth() === today.getMonth() &&
      cellDate.getFullYear() === today.getFullYear()
    );
  }

  function isCompleted(cellDate) {
    return cellDate && completedDates.includes(toISODate(cellDate));
  }

  // Compact/expanded dimensions
  const numWeeks = expanded ? Math.ceil((daysArr.length) / 7) : 2; // 2 rows in compact
  const displayRows = [];
  for (let r = 0; r < numWeeks; ++r) {
    displayRows.push(daysArr.slice(r * 7, r * 7 + 7));
  }

  // Widget card style based on dashboard palette
  const cardStyle = {
    background: "rgba(255,255,255,0.98)",
    borderRadius: 18,
    boxShadow: "0 2px 10px rgba(123,97,229,0.08)",
    padding: expanded ? "20px 22px 18px 22px" : "12px 13px 10px 13px",
    marginBottom: 18,
    width: "100%",
    maxWidth: 352,
    minWidth: 0,
    transition: "box-shadow 0.2s, padding 0.15s",
    position: "relative",
  };

  return (
    <section style={cardStyle} aria-label="Mini Calendar Progress">
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 7,
      }}>
        <span
          style={{
            fontWeight: 700, color: "#3B1877", fontSize: expanded ? "1.11rem" : "1.04rem",
            marginRight: 4, letterSpacing: 0.02,
          }}
        >
          Calendar
        </span>
        <button
          type="button"
          aria-label={expanded ? "Collapse calendar" : "Expand calendar"}
          onClick={() => setExpanded((v) => !v)}
          style={{
            background: "none",
            border: "none",
            color: "#9374CF",
            fontWeight: 600,
            fontSize: "0.95rem",
            padding: "2px 7px",
            borderRadius: 7,
            cursor: "pointer",
            transition: "background 0.16s",
            outline: "none",
            marginLeft: 0,
            marginRight: 0,
          }}
        >
          {expanded ? "Collapse" : "Expand"}
        </button>
      </div>
      {/* Days of week header */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(7, 1fr)",
        fontSize: "0.93rem",
        letterSpacing: 0.03,
        color: "var(--ht-secondary-text)",
        marginBottom: 4,
        textAlign: "center",
        fontWeight: 600,
        opacity: 0.85,
      }}>
        {weekDays.map(d => (<span key={d}>{d}</span>))}
      </div>
      {loading ? (
        <div style={{
          width: "100%",
          minHeight: 44,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "var(--ht-secondary-text)",
          opacity: 0.7,
          fontSize: "1.01rem",
        }}>
          Loading...
        </div>
      ) : error ? (
        <div style={{
          width: "100%",
          minHeight: 38,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#EF4565",
          fontWeight: 600,
          background: "#FBE3E6",
          borderRadius: 7,
          fontSize: "0.98rem",
        }}>
          {error}
        </div>
      ) : (
        <div>
          {/* Calendar weeks */}
          {displayRows.map((row, ridx) => (
            <div key={ridx}
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(7, 1fr)",
                gap: expanded ? 2 : 0,
                marginBottom: expanded ? 2 : 0,
              }}>
              {row.map((cell, cidx) =>
                cell ? (
                  <span
                    key={cidx}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: expanded ? 36 : 27,
                      height: expanded ? 32 : 23,
                      borderRadius: 99,
                      margin: expanded ? "2px 0" : "0 0",
                      background: isToday(cell) ? "#E3DCF5" : "none",
                      border: isToday(cell) ? "1.5px solid #8866DE" : "none",
                      boxShadow: isToday(cell) ? "0 1px 5px rgba(123,97,229,0.09)" : "none",
                      color: isToday(cell) ? "#894EE5" : "#222340",
                      fontWeight: isToday(cell) ? 700 : 500,
                      fontSize: expanded ? "1.07rem" : "0.98rem",
                      position: "relative",
                      cursor: "default",
                      userSelect: "none",
                      transition: "background,border 0.18s",
                    }}>
                    {cell.getDate()}
                    {/* Completion dot/marker */}
                    {isCompleted(cell) && (
                      <span
                        aria-label="Habit completed"
                        style={{
                          display: "inline-block",
                          position: "absolute",
                          left: "55%",
                          bottom: 2,
                          width: expanded ? 9 : 7,
                          height: expanded ? 9 : 7,
                          borderRadius: "50%",
                          background: getDotColor(cell),
                          border: "1px solid #ede4fe",
                          boxShadow: "0 3px 10px #bdb9ed33",
                        }}
                      />
                    )}
                  </span>
                ) : (
                  <span key={cidx} style={{ height: expanded ? 32 : 23 }} />
                )
              )}
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

export default MiniCalendarWidget;
