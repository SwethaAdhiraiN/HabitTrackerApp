import React, { useState, useRef, useLayoutEffect } from "react";

/**
 * PUBLIC_INTERFACE
 * CalendarWithEmotions
 * Displays a monthly calendar with emoji emotion markers per date.
 * Only today's cell is interactive for logging/updating/removing emotion.
 * All other days are view-only (click ignored, visually less interactive).
 */

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];
const EMOJI_OPTIONS = [
  "😄", "😊", "😐", "😟", "😢", "🥳", "😴", "💪", "😭", "😅", "🫤", "😜"
];
// Weekday header labels, always Sunday-first
const WEEKDAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function pad(num) {
  return num < 10 ? "0" + num : "" + num;
}
function dateISO(date) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}
function getMonthMatrix(year, monthIdx) {
  const firstDay = new Date(year, monthIdx, 1);
  const lastDay = new Date(year, monthIdx + 1, 0);
  const matrix = [];
  let week = Array(firstDay.getDay()).fill(null);

  for (let d = 1; d <= lastDay.getDate(); d++) {
    week.push(new Date(year, monthIdx, d));
    if (week.length === 7) {
      matrix.push(week);
      week = [];
    }
  }
  if (week.length > 0) {
    while (week.length < 7) week.push(null);
    matrix.push(week);
  }
  return matrix;
}

function CalendarWithEmotions() {
  // emotionData: { 'YYYY-MM-DD': emoji }
  const [emotionData, setEmotionData] = useState(() => {
    try {
      const raw = localStorage.getItem("emotion-tracker");
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  });
  const [selected, setSelected] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });
  const [emojiPickerOpen, setEmojiPickerOpen] = useState(null); // key: dateISO
  const [popoverPos, setPopoverPos] = useState({ top: 0, left: 0, width: 0 });

  // Refs for all day-cells; keys = dateISO strings
  const dayCellRefs = useRef({});
  // Parent calendar wrap ref (for bounding)
  const calendarRef = useRef(null);

  // Save emotionData to storage on change
  React.useEffect(() => {
    try {
      localStorage.setItem("emotion-tracker", JSON.stringify(emotionData));
    } catch {}
  }, [emotionData]);

  const year = selected.getFullYear();
  const monthIdx = selected.getMonth();
  const todayObj = new Date();
  const todayISOstr = dateISO(todayObj);
  const isCurrentMonth = todayObj.getFullYear() === year && todayObj.getMonth() === monthIdx;
  const monthMatrix = getMonthMatrix(year, monthIdx);

  // Calendar navigation
  function goToPrevMonth() {
    setSelected(prev => {
      const m = prev.getMonth() === 0 ? 11 : prev.getMonth() - 1;
      const y = prev.getMonth() === 0 ? prev.getFullYear() - 1 : prev.getFullYear();
      return new Date(y, m, 1);
    });
    setEmojiPickerOpen(null);
  }
  function goToNextMonth() {
    setSelected(prev => {
      const m = prev.getMonth() === 11 ? 0 : prev.getMonth() + 1;
      const y = prev.getMonth() === 11 ? prev.getFullYear() + 1 : prev.getFullYear();
      return new Date(y, m, 1);
    });
    setEmojiPickerOpen(null);
  }

  // Visual feedback: only today's cell is interactive
  function isDateTodayCell(dateObj) {
    return (
      dateObj &&
      isCurrentMonth &&
      dateObj.getDate() === todayObj.getDate()
    );
  }

  // Only allow emoji picker to open on today's cell
  function handleOpenEmojiPicker(dISO, dateObj) {
    if (!dateObj || !isDateTodayCell(dateObj)) return;
    setEmojiPickerOpen(dISO);

    // Anchor position
    setTimeout(() => {
      const ref = dayCellRefs.current && dayCellRefs.current[dISO];
      const calRefCurrent = calendarRef.current;
      if (ref && calRefCurrent) {
        const rect = ref.getBoundingClientRect();
        const calRect = calRefCurrent.getBoundingClientRect();
        setPopoverPos({
          top: rect.bottom - calRect.top,
          left: rect.left - calRect.left + rect.width / 2,
          width: rect.width,
        });
      } else {
        setPopoverPos(pos => ({
          ...pos,
        }));
      }
    }, 0);
  }

  function handleSetEmoji(dayISO, emoji) {
    setEmotionData(prev => ({
      ...prev,
      [dayISO]: emoji
    }));
    setEmojiPickerOpen(null);
  }
  function handleRemoveEmoji(dayISO) {
    setEmotionData(prev => {
      const next = { ...prev };
      delete next[dayISO];
      return next;
    });
    setEmojiPickerOpen(null);
  }

  // On scroll/resize/calendarRef changes: update popover anchor
  useLayoutEffect(() => {
    if (!emojiPickerOpen) return;
    const ref = dayCellRefs.current && dayCellRefs.current[emojiPickerOpen];
    const calRefCurrent = calendarRef.current;
    if (ref && calRefCurrent) {
      const rect = ref.getBoundingClientRect();
      const calRect = calRefCurrent.getBoundingClientRect();
      setPopoverPos({
        top: rect.bottom - calRect.top,
        left: rect.left - calRect.left + rect.width / 2,
        width: rect.width,
      });
    }
    function recalc() {
      if (!emojiPickerOpen) return;
      const refUpd = dayCellRefs.current && dayCellRefs.current[emojiPickerOpen];
      const calRectUpd = calendarRef.current;
      if (refUpd && calRectUpd) {
        const rectUpd = refUpd.getBoundingClientRect();
        const calRectUpdRect = calRectUpd.getBoundingClientRect();
        setPopoverPos({
          top: rectUpd.bottom - calRectUpdRect.top,
          left: rectUpd.left - calRectUpdRect.left + rectUpd.width / 2,
          width: rectUpd.width,
        });
      }
    }
    window.addEventListener("resize", recalc);
    window.addEventListener("scroll", recalc, true);
    return () => {
      window.removeEventListener("resize", recalc);
      window.removeEventListener("scroll", recalc, true);
    };
    // eslint-disable-next-line
  }, [emojiPickerOpen, selected]);

  function emojiForDate(dateObj) {
    if (!dateObj) return "";
    return emotionData[dateISO(dateObj)] || "";
  }

  /**
   * EmojiPickerPopover
   * Popup menu visually anchored below clicked date cell (from popoverPos).
   * Responsive positioning—never overflow outside calendar.
   */
  function EmojiPickerPopover({ popoverPos, anchorISO, onSelect, onRemove, onClose, calendarParentRef }) {
    const popoverRef = useRef(null);
    const [menuStyle, setMenuStyle] = useState({});

    useLayoutEffect(() => {
      if (
        !popoverRef.current ||
        !calendarParentRef.current ||
        typeof popoverPos.left !== "number" ||
        typeof popoverPos.top !== "number"
      )
        return;

      const calWidth = calendarParentRef.current.offsetWidth;
      let leftPx = popoverPos.left;
      let minLeft = 8;
      let maxLeft = calWidth - 262 - 8;

      if (leftPx - 130 < minLeft) leftPx = minLeft + 130;
      if (leftPx - 130 > maxLeft + 130) leftPx = maxLeft + 130;
      let actualLeft = leftPx - 130;
      if (actualLeft < minLeft) actualLeft = minLeft;
      if (actualLeft > maxLeft) actualLeft = maxLeft;

      setMenuStyle({
        left: actualLeft,
        top: popoverPos.top + 8,
      });
      setTimeout(() => {
        if (popoverRef.current) {
          const btn = popoverRef.current.querySelector
            ? popoverRef.current.querySelector("button")
            : null;
          if (btn) btn.focus();
        }
      }, 0);
      // eslint-disable-next-line
    }, [popoverPos.left, popoverPos.top, anchorISO, calendarParentRef]);

    // Close on outside click
    useLayoutEffect(() => {
      function handleDocClick(e) {
        if (
          popoverRef.current &&
          !popoverRef.current.contains(e.target)
        ) {
          onClose();
        }
      }
      document.addEventListener("mousedown", handleDocClick);
      return () => document.removeEventListener("mousedown", handleDocClick);
    }, [onClose]);

    return (
      <div
        ref={popoverRef}
        style={{
          position: "absolute",
          zIndex: 1000,
          minWidth: 260,
          background: "#fff",
          border: "1.2px solid #EBD7FF",
          borderRadius: 13,
          boxShadow: "0 2px 17px rgba(102,80,179,.13)",
          padding: "14px 12px 11px 12px",
          display: "flex",
          flexWrap: "wrap",
          gap: "4px 7px",
          maxWidth: 360,
          ...menuStyle,
          transition: "opacity 0.13s",
        }}
        role="dialog"
        aria-modal="true"
        tabIndex={-1}
      >
        {EMOJI_OPTIONS.map((emoji) => (
          <button
            key={emoji}
            style={{
              fontSize: "1.48em",
              width: 37,
              height: 35,
              margin: "0 2.2px 6px 2.2px",
              background: emotionData[anchorISO] === emoji ? "#F6F4FB" : "#FAF8FE",
              border: "none",
              borderRadius: 8,
              cursor: "pointer",
              outline: "none",
              fontWeight: emotionData[anchorISO] === emoji ? 800 : 500,
              boxShadow: emotionData[anchorISO] === emoji ? "0 0 0 3.5px #AC69F055" : "none"
            }}
            onClick={() => onSelect(anchorISO, emoji)}
            tabIndex={0}
            aria-label={"Set emotion " + emoji}
            type="button"
          >
            {emoji}
          </button>
        ))}
        <button
          style={{
            marginLeft: 9,
            background: "#FFE4ED",
            border: "none",
            borderRadius: 12,
            color: "#BD3973",
            fontWeight: 700,
            fontSize: "1.04em",
            padding: "5px 15px",
            cursor: "pointer",
            minWidth: 48
          }}
          onClick={() => onRemove(anchorISO)}
          tabIndex={0}
          type="button"
        >Remove</button>
        <button
          style={{
            marginLeft: 9,
            background: "#EEE",
            border: "none",
            borderRadius: 9,
            color: "#998fae",
            fontWeight: 600,
            fontSize: "0.94em",
            padding: "4.5px 10px",
            cursor: "pointer"
          }}
          onClick={onClose}
          tabIndex={0}
          aria-label="Close emoji selector"
          type="button"
        >×</button>
      </div>
    );
  }

  // Calendar UI
  return (
    <section
      ref={calendarRef}
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
        position: "relative",
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
          {MONTH_NAMES[monthIdx]} {year}
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
      {/* Calendar weekday header */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(7, 1fr)",
          gap: "0.18rem",
          marginBottom: 4,
        }}
      >
        {WEEKDAY_NAMES.map(wd => (
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
          gap: "0.26rem",
          minHeight: 185,
          marginBottom: 9,
          alignItems: "stretch",
        }}
      >
        {monthMatrix.map((week, wi) =>
          week.map((dateObj, di) => {
            if (!dateObj) return <div key={`blank-${wi}-${di}`} />;
            const d = dateObj.getDate();
            const dISO = dateISO(dateObj);
            const isToday = isDateTodayCell(dateObj);
            const emoji = emojiForDate(dateObj);

            // Only today is interactive; others look muted and clicking them does nothing
            if (isToday) {
              return (
                <button
                  key={dISO}
                  ref={el => { if (el) dayCellRefs.current[dISO] = el; }}
                  aria-label={`Today, ${d}. Click to log or change your emotion.`}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleOpenEmojiPicker(dISO, dateObj);
                  }}
                  style={{
                    aspectRatio: "1",
                    width: "100%",
                    minWidth: 0,
                    minHeight: 32,
                    maxWidth: 44,
                    background: "linear-gradient(90deg,#F9EBFF 65%,#DCFAF5 100%)",
                    border: "none",
                    outline: "2.5px solid var(--ht-primary,#6951C7)",
                    borderRadius: 13,
                    margin: 0,
                    padding: "0.27rem 0 0.23rem 0",
                    fontSize: 15.2,
                    fontWeight: 700,
                    color: "#463B70",
                    cursor: "pointer",
                    position: "relative",
                    boxShadow: "0 2px 9px rgba(140,119,217,.12)",
                    transition: "background .13s, outline .13s",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                  tabIndex={0}
                  type="button"
                  title="Today: Click to log/update your mood"
                >
                  <span>{d}</span>
                  {emoji && (
                    <span
                      style={{
                        display: "inline-block",
                        fontSize: "1.22em",
                        marginTop: 1,
                        lineHeight: 1.24,
                      }}
                    >
                      {emoji}
                    </span>
                  )}
                </button>
              );
            }

            // All other days: view-only (not interactive)
            return (
              <div
                key={dISO}
                ref={el => { if (el) dayCellRefs.current[dISO] = el; }}
                aria-label={`Day ${d}. View only.`}
                style={{
                  aspectRatio: "1",
                  width: "100%",
                  minWidth: 0,
                  minHeight: 32,
                  maxWidth: 44,
                  background: "rgba(249,249,252,0.76)",
                  border: "none",
                  outline: "none",
                  borderRadius: 13,
                  margin: 0,
                  padding: "0.27rem 0 0.23rem 0",
                  fontSize: 15.2,
                  fontWeight: 500,
                  color: "#C0BDD6",
                  cursor: "default",
                  opacity: 0.60,
                  position: "relative",
                  boxShadow: "none",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  userSelect: "none",
                  pointerEvents: "none", // disables click!
                }}
                tabIndex={-1}
                title="Past/future date. View only."
              >
                <span>{d}</span>
                {emoji && (
                  <span
                    style={{
                      display: "inline-block",
                      fontSize: "1.22em",
                      marginTop: 1,
                      lineHeight: 1.24,
                    }}
                  >
                    {emoji}
                  </span>
                )}
                {/* Visual lock for non-today */}
                <span
                  style={{
                    position: "absolute",
                    right: 4,
                    bottom: 3,
                    fontSize: "1em",
                    color: "#E7D7F2"
                  }}
                  aria-hidden="true"
                  title="Locked"
                >
                  🔒
                </span>
              </div>
            );
          }),
        )}
      </div>
      {/* Popover for emoji picker, overlays above, not disrupting layout */}
      {emojiPickerOpen && (
        <EmojiPickerPopover
          popoverPos={popoverPos}
          anchorISO={emojiPickerOpen}
          onSelect={handleSetEmoji}
          onRemove={handleRemoveEmoji}
          onClose={() => setEmojiPickerOpen(null)}
          calendarParentRef={calendarRef}
        />
      )}
      {/* Today summary (for accessibility/feedback): */}
      <div
        style={{
          marginTop: 8,
          textAlign: "center",
          minHeight: "2.2em"
        }}
        aria-live="polite"
      >
        {emotionData[todayISOstr] && (
          <span style={{fontSize:"2em"}}>{emotionData[todayISOstr]}</span>
        )}
      </div>
    </section>
  );
}

export default CalendarWithEmotions;
