import React, { useEffect, useState } from "react";
import styles from "./styles/Dashboard.module.css";

/**
 * PUBLIC_INTERFACE
 * MiniCalendarWidget — Sidebar dashboard calendar showing per-day habit completion for user.
 * - Fetches user's /api/progress and visualizes which days had full or partial completions.
 * - Highlights today.
 * - Allows "expand" to show the full month; collapsed shows compact week view.
 * - Uses pastel theme and matches dashboard/card layout.
 * - Handles loading and error states gracefully.
 *
 * Usage: <MiniCalendarWidget userId={userId} />
 */
function MiniCalendarWidget({ userId }) {
  // States for progress, focus, error, expanded
  const [loading, setLoading] = useState(true);
  const [errMsg, setErrMsg] = useState("");
  const [progressByDate, setProgressByDate] = useState({});
  const [expanded, setExpanded] = useState(false);

  // --- Fetch all progress for this month
  useEffect(() => {
    let cancelled = false;
    if (!userId) {
      setProgressByDate({});
      setErrMsg("No user");
      setLoading(false);
      return;
    }
    setLoading(true);
    setErrMsg("");
    setProgressByDate({});

    const { month, year } = getMonthYear(new Date());
    const firstOfMonth = new Date(year, month, 1);
    const lastOfMonth = new Date(year, month + 1, 0);
    const daysArr = [];
    for (let d = new Date(firstOfMonth); d <= lastOfMonth; d.setDate(d.getDate() + 1)) {
      daysArr.push(d.toISOString().split("T")[0]);
    }

    // Fetch all progress for user and map by date string
    fetch(`/api/progress?user_id=${userId}`)
      .then((resp) => resp.ok ? resp.json() : Promise.reject("Could not load progress"))
      .then((data) => {
        if (!data.success || !Array.isArray(data.progress)) throw new Error("No data");
        // Map by date string for this month
        const pMap = {};
        for (const p of data.progress || []) {
          if (typeof p.date === "string") pMap[p.date] = p;
        }
        if (!cancelled) setProgressByDate(pMap);
      })
      .catch(err => {
        if (!cancelled) setErrMsg("Could not load calendar.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, [userId]);

  // --- Helpers
  function getMonthYear(dt) {
    return { month: dt.getMonth(), year: dt.getFullYear() };
  }
  function getDaysInMonth(month, year) {
    return new Date(year, month + 1, 0).getDate();
  }
  function getMonthLabel(month, year) {
    return new Date(year, month).toLocaleString(undefined, { month: "long", year: "numeric" });
  }

  // --- UI: Collapsed = 1 week (centered on today), Expanded = full month
  const today = new Date();
  const { month, year } = getMonthYear(today);
  const calendarWeeks = buildCalendarWeeks(month, year);

  // Weekday labels, always starts on Sunday
  const weekdayLabels = ["S", "M", "T", "W", "T", "F", "S"];

  // Build weeks for this month (for grid display)
  function buildCalendarWeeks(month, year) {
    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);
    // Array of weeks (each is an array of 7 Date objects or null)
    const weeks = [];
    let current = new Date(firstDayOfMonth);
    let week = [];
    // Pad first week
    for (let i = 0; i < current.getDay(); ++i) week.push(null);

    while (
      current <= lastDayOfMonth
    ) {
      week.push(new Date(current));
      if (week.length === 7) {
        weeks.push(week);
        week = [];
      }
      current.setDate(current.getDate() + 1);
    }
    // Fill trailing days
    while (week.length > 0 && week.length < 7) {
      week.push(null);
    }
    if (week.length === 7) weeks.push(week);
    return weeks;
  }

  // Collapse logic: if not expanded, center week on today
  let shownWeeks = calendarWeeks;
  if (!expanded) {
    const todayStr = today.toISOString().split("T")[0];
    let weekIdx = calendarWeeks.findIndex(week =>
      week.some(
        d =>
          d &&
          d.getFullYear() === today.getFullYear() &&
          d.getMonth() === today.getMonth() &&
          d.getDate() === today.getDate()
      )
    );
    if (weekIdx === -1) weekIdx = 0;
    shownWeeks = [calendarWeeks[weekIdx]];
  }

  // For showing completions, we'll use colored dots: green for all done, blue for some, gray for none.
  function dayCompletionStatus(dateStr) {
    const progress = progressByDate[dateStr];
    if (!progress) return "none";
    if (!progress.habit_checkmarks) return "none";
    const checkArr = Object.values(progress.habit_checkmarks);
    const total = progress.total_habits || checkArr.length || 1;
    const checked = progress.total_checked || checkArr.filter(Boolean).length;
    if (checked === 0) return "none";
    if (checked === total) return "all";
    return "some";
  }
  function completionDot(dateStr, isToday) {
    const status = dayCompletionStatus(dateStr);
    let color = "#E1E5E9";
    if (status === "all") color = "var(--accent-green, #54CB73)";
    if (status === "some") color = "var(--ht-primary, #687FE5)";
    if (isToday) color = "var(--ht-primary, #687FE5)";
    return (
      <span style={{
        display: "inline-block",
        width: 7,
        height: 7,
        borderRadius: "50%",
        background: color,
        marginTop: 2,
        marginBottom: 0
      }}/>
    );
  }

  // Month navigation (optional future enhancement, disable for now)
  // JSX calendar rendering
  return (
    <div className={styles.calendarWidget} aria-label="Mini Calendar">
      <div className={styles.calendarHeader} style={{ display: "flex", alignItems: "center", width: "100%" }}>
        <span>{getMonthLabel(month, year)}</span>
        <span style={{ flex: 1 }} />
        <button
          type="button"
          aria-label={expanded ? "Collapse calendar view" : "Expand to full month"}
          onClick={() => setExpanded(x => !x)}
          style={{
            border: "none",
            background: "none",
            color: "var(--ht-primary, #687FE5)",
            fontWeight: 600,
            fontSize: "0.99em",
            padding: 0,
            cursor: "pointer",
            outline: "none"
          }}
        >
          {expanded ? "Collapse" : "Expand"}
        </button>
      </div>
      {loading ? (
        <div style={{ marginTop: 14, minHeight: 33, width: "100%", opacity: 0.59, fontStyle: "italic" }}>
          Loading calendar...
        </div>
      ) : errMsg ? (
        <div style={{ color: "var(--ht-error,#F87A77)", fontWeight: 600, marginTop: 7, minHeight: 33 }}>{errMsg}</div>
      ) : (
        <div style={{ width: "100%" }}>
          <div className={styles.calendarDaysRow} style={{ marginBottom: 2 }}>
            {weekdayLabels.map((label, k) => (
              <div key={label} className={styles.calendarDay}>
                <div className={styles.dayLabel}>{label}</div>
              </div>
            ))}
          </div>
          {shownWeeks.map((week, rowidx) => (
            <div className={styles.calendarDaysRow} key={rowidx}>
              {week.map((date, ci) => {
                if (!date) return (
                  <div key={ci} className={styles.calendarDay} style={{ visibility: "hidden" }}>
                    <div className={styles.dayLabel}></div>
                    <div className={styles.dayCircle}></div>
                  </div>
                );
                const dateStr = date.toISOString().split("T")[0];
                const isToday = (
                  date.getFullYear() === today.getFullYear() &&
                  date.getMonth() === today.getMonth() &&
                  date.getDate() === today.getDate()
                );
                let circleBg = "#fff";
                let circleStyle = {};
                if (isToday) {
                  circleBg = "var(--ht-primary,#687FE5)";
                  circleStyle = {
                    color: "#fff", fontWeight: 700, border: "2px solid #4354B8",
                    background: circleBg, transition: "background 0.12s"
                  };
                } else if (dayCompletionStatus(dateStr) === "all") {
                  circleBg = "var(--accent-green, #54CB73)";
                  circleStyle = { color: "#fff", background: circleBg, fontWeight: 700 };
                } else if (dayCompletionStatus(dateStr) === "some") {
                  circleBg = "var(--ht-surface, #EBD6FB)";
                  circleStyle = { color: "var(--ht-primary,#687FE5)", background: circleBg };
                } else {
                  circleStyle = { color: "#B0B0C3", background: "#fff" };
                }
                return (
                  <div key={ci} className={styles.calendarDay}>
                    <div className={styles.dayCircle} style={circleStyle}>
                      {date.getDate()}
                    </div>
                    {completionDot(dateStr, isToday)}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      )}
      <div style={{
        marginTop: 8,
        fontSize: "0.98em",
        color: "#A4A8B6",
        fontWeight: 400,
        opacity: 0.78,
        lineHeight: 1.2
      }}>
        <span>
          <span style={{ verticalAlign: "middle", display: "inline-block", width: 10, height: 10, borderRadius: "50%", background: "var(--accent-green,#54CB73)", marginRight: 3 }} />
          All habits done
        </span>
        {" | "}
        <span>
          <span style={{ verticalAlign: "middle", display: "inline-block", width: 10, height: 10, borderRadius: "50%", background: "var(--ht-primary,#687FE5)", marginRight: 3 }} />
          Partial
        </span>
        {" | "}
        <span>
          <span style={{ verticalAlign: "middle", display: "inline-block", width: 10, height: 10, borderRadius: "50%", background: "#E1E5E9", marginRight: 3 }} />
          None
        </span>
      </div>
    </div>
  );
}

export default MiniCalendarWidget;
