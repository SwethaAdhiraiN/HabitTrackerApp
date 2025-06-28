import React, { useState, useEffect, useRef } from "react";

/**
 * PUBLIC_INTERFACE
 * CalendarWithEmotions
 * Displays a monthly calendar with emoji emotion markers per date.
 * Today only: click today's cell to assign/remove any emoji via menu (emojis are stored in localStorage).
 * The visual appearance of the calendar remains identical except for today's emoji badge.
 */
const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

// Set of available smiley emoji for today-only selector (expandable)
const EMOJI_OPTIONS = [
  "😀","😁","😊","😇","🙂","😉","😌","😍","🤩","🥳",
  "😜","😎","😐","😕","🙁","😞","😢","😭","😡","🤔",
  "😏","😴","😅","😂","😭","😱"
];

// Util: zero pad
function pad(num) {
  return num < 10 ? "0" + num : "" + num;
}

// Util: get ISO yyyy-mm-dd for a Date
function dateISO(date) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

// Util: get month matrix (array of weeks, each week = array of dates/null)
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

function todayISO() {
  const now = new Date();
  return dateISO(now);
}

function CalendarWithEmotions() {
  // emotionData: { 'YYYY-MM-DD': emoji }
  const [emotionData, setEmotionData] = useState({});
  const [selected, setSelected] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });
  const [emojiPickerOpen, setEmojiPickerOpen] = useState(false);

  // For proper popover
  const todayButtonRef = useRef(null);

  useEffect(() => {
    // On mount: load emotionData from storage
    try {
      const raw = localStorage.getItem("emotion-tracker");
      if (raw) setEmotionData(JSON.parse(raw));
    } catch {}
  }, []);

  // Save emotionData on change
  useEffect(() => {
    try {
      localStorage.setItem("emotion-tracker", JSON.stringify(emotionData));
    } catch {}
  }, [emotionData]);

  // Calendar matrix for current month
  const year = selected.getFullYear();
  const monthIdx = selected.getMonth();
  const todayISOstr = todayISO();
  const monthMatrix = getMonthMatrix(year, monthIdx);

  // Navigation
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

  // Set emoji for today
  function handleSelectEmoji(emoji) {
    setEmotionData(prev => ({
      ...prev,
      [todayISOstr]: emoji
    }));
    setEmojiPickerOpen(false);
  }
  // Remove today's emoji
  function handleRemoveEmoji() {
    setEmotionData(prev => {
      const next = { ...prev };
      delete next[todayISOstr];
      return next;
    });
    setEmojiPickerOpen(false);
  }

  // Click outside closes
  useEffect(() => {
    if (!emojiPickerOpen) return;
    function listener(e) {
      if (
        todayButtonRef.current &&
        !todayButtonRef.current.contains(e.target)
      ) {
        setEmojiPickerOpen(false);
      }
    }
    document.addEventListener("mousedown", listener, true);
    return () => document.removeEventListener("mousedown", listener, true);
  }, [emojiPickerOpen]);

  // Get emoji for calendar date
  function emojiForDate(dateObj) {
    if (!dateObj) return "";
    return emotionData[dateISO(dateObj)] || "";
  }

  // Render emoji picker popover (absolute, layered over, without disturbing layout)
  function EmojiPickerPopover({ anchorRef, onSelect, onRemove, onClose }) {
    // Render the popover near today's cell
    const [style, setStyle] = useState({});
    useEffect(() => {
      if (!anchorRef.current) return;
      const rect = anchorRef.current.getBoundingClientRect();
      setStyle({
        position: "absolute",
        top: rect.bottom + window.scrollY + 6,
        left: rect.left + window.scrollX - 25,
        zIndex: 1000,
        background: "#fff",
        border: "1.2px solid #EBD7FF",
        borderRadius: 13,
        boxShadow: "0 2px 17px rgba(102,80,179,.13)",
        minWidth: 236,
        padding: "14px 12px 11px 12px",
        display: "flex",
        flexWrap: "wrap",
        gap: "4px 7px",
        maxWidth: 350,
      });
    }, [anchorRef]);
    return (
      <div style={style}>
        {EMOJI_OPTIONS.map((emoji, i) => (
          <button
            key={emoji}
            style={{
              fontSize: "1.54em",
              width: 37,
              height: 35,
              margin: "0 2.3px 6px 2.3px",
              background: "#F6F4FB",
              border: "none",
              borderRadius: 8,
              cursor: "pointer",
              outline: "none",
              fontWeight: emotionData[todayISOstr] === emoji ? 800 : 500,
              boxShadow: emotionData[todayISOstr] === emoji ? "0 0 0 3.5px #AC69F055" : "none"
            }}
            onClick={() => onSelect(emoji)}
            tabIndex={0}
            aria-label={"Set emotion " + emoji}
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
          onClick={onRemove}
          tabIndex={0}
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
        >✕</button>
      </div>
    )
  }

  // Calendar render
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
        position: "relative"
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
          gap: "0.2rem",
          marginBottom: 4,
        }}
      >
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(wd => (
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
        {monthMatrix.map((week, wi) =>
          week.map((dateObj, di) => {
            if (!dateObj) return <div key={`blank-${wi}-${di}`} />;
            const d = dateObj.getDate();
            const dISO = dateISO(dateObj);
            const isToday = dISO === todayISOstr;
            const emoji = emojiForDate(dateObj);

            return (
              <button
                key={dISO}
                // Only today gets a ref and click handler
                ref={isToday ? todayButtonRef : null}
                aria-label={`Day ${d}` + (emoji ? `, feeling ${emoji}` : "")}
                onClick={
                  isToday
                    ? (e) => {
                        e.preventDefault();
                        setEmojiPickerOpen(open => !open);
                      }
                    : undefined
                }
                style={{
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
                  cursor: isToday ? "pointer" : "default",
                  position: "relative",
                  boxShadow: isToday ? "0 2px 9px rgba(140,119,217,.12)" : "none",
                  transition: "background .13s, outline .13s",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                }}
                tabIndex={0}
                type="button"
              >
                <span>{d}</span>
                {/* Emoji badge if present */}
                {emoji && (
                  <span
                    style={{
                      display: "inline-block",
                      fontSize: "1.38em",
                      marginTop: 1,
                      lineHeight: 1.2,
                    }}
                  >
                    {emoji}
                  </span>
                )}
              </button>
            );
          })
        )}
      </div>

      {/* Popover for emoji picker, overlays above, not disrupting layout */}
      {emojiPickerOpen && (
        <EmojiPickerPopover
          anchorRef={todayButtonRef}
          onSelect={handleSelectEmoji}
          onRemove={handleRemoveEmoji}
          onClose={() => setEmojiPickerOpen(false)}
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
