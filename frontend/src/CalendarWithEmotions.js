import React, { useEffect, useState } from "react";

// Colors: ['#FCD8CD', '#FEEBF6', '#EBD6FB', '#687FE5'] (main pastels, accent).
const pastelPalette = ["#FCD8CD", "#FEEBF6", "#EBD6FB", "#687FE5"];

// All standard Unicode smiley/emotion emoji (neutral color for each, since browser renders natively)
const EMOTION_EMOJIS = [
  "😀", "😃", "😄", "😁", "😆", "😉", "😊", "🙂", "🙃", "😋",
  "😎", "😍", "🥰", "😘", "😗", "😙", "😚", "🤗", "☺️", "🤔",
  "😐", "😶", "😑", "😬", "🙄", "😏", "😔", "😞", "😟", "😕",
  "😣", "😖", "😫", "😩", "🥺", "😢", "😭", "😤", "😠", "😡",
  "🤬", "🤯", "😳", "🥵", "🥶", "😱", "😨", "😰", "😥", "😓",
  "🤤", "😴", "😪", "🤒", "🤕", "🤑", "🤠", "😷", "🤡", "👿",
  "😇", "🥳"
];

// Find user from storage (session/local)
function getCurrentUser() {
  try {
    const u =
      JSON.parse(sessionStorage.getItem("habit_user") || localStorage.getItem("habit_user") || "null");
    return u && u.id ? u : null;
  } catch {
    return null;
  }
}

// Helper for Modal
function Modal({ open, onClose, children }) {
  if (!open) return null;
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 80,
        background: "rgba(34,34,55,0.18)",
        backdropFilter: "blur(2.6px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        transition: "background 0.15s",
      }}
      onClick={onClose}
      aria-modal="true"
      role="dialog"
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          minWidth: 240,
          maxWidth: "96vw",
          width: 348,
          background: "#fff",
          borderRadius: 24,
          boxShadow: "0 3px 27px #cbbbe8bb, 0 1.5px 6px #eae4fc",
          padding: "30px 24px 23px 24px",
          position: "relative",
          fontFamily: "inherit"
        }}
      >
        {children}
        <button
          type="button"
          tabIndex={0}
          aria-label="Close Modal"
          style={{
            position: "absolute",
            top: 13, right: 16,
            background: "none", border: "none", fontSize: 21,
            color: "#687FE5", cursor: "pointer", borderRadius: 6,
            transition: "background .14s",
          }}
          onClick={onClose}
        >×</button>
      </div>
    </div>
  );
}

function getMonthDays(year, month) {
  // 0-indexed month
  const first = new Date(year, month, 1);
  const last = new Date(year, month + 1, 0);
  const numDays = last.getDate();
  return { first, last, numDays };
}

// Format date as YYYY-MM-DD (UTC)
function toISO(d) {
  return d.toISOString().slice(0, 10);
}

/**
 * PUBLIC_INTERFACE
 * CalendarWithEmotions
 * Shows a full monthly responsive pastel calendar, with per-day emotion emojis overlaid.
 * Clicking today's date opens modal for selecting emoji, which is POSTed to backend and calendar updates.
 * On load, fetches all mapped emotions for that user.
 * Responsive and accessible for Dashboard page, visually matches sidebar widgets.
 */
function CalendarWithEmotions({ style = {} }) {
  const [emotions, setEmotions] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [chosen, setChosen] = useState(""); // Chosen emoji for today
  const user = getCurrentUser();
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  const { first, numDays } = getMonthDays(year, month);

  // Find the user's emotion map for the current month on mount/refresh.
  // Fetch and display emotions for the user only once on mount
  useEffect(() => {
    if (!user) return;
    setLoading(true);
    setError("");
    fetch(`/api/emotion?user_id=${user.id}`)
      .then(r => r.ok ? r.json() : Promise.reject("API error"))
      .then(data => {
        if (!data.success) throw new Error("API: Not Success");
        setEmotions(data.emotions || {});
      })
      .catch(() => setError("Could not load emotions"))
      .finally(() => setLoading(false));
  // Only fetch on mount (not on every user change)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleDayClick(day) {
    // Only today's date opens modal
    const d = new Date(year, month, day);
    if (
      d.getDate() === today.getDate() &&
      d.getMonth() === today.getMonth() &&
      d.getFullYear() === today.getFullYear()
    ) {
      setModalOpen(true);
    }
  }

  // PUBLIC_INTERFACE
  function handleSaveEmotion(emoji) {
    // 1. Save new emotion via API
    // 2. After a successful POST, re-fetch the full emotion dataset and update in place (showing loader only within the modal)
    if (!user) return;
    setLoading(true);
    fetch("/api/emotion", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_id: user.id,
        date: toISO(today),
        emotion: emoji
      })
    })
      .then(r => r.ok ? r.json() : Promise.reject("API error"))
      .then(data => {
        setModalOpen(false);
        setChosen(emoji);

        // Immediately re-fetch emotion data for UI update; keep calendar visible
        fetch(`/api/emotion?user_id=${user.id}`)
          .then(r => r.ok ? r.json() : Promise.reject("API error"))
          .then(data => {
            if (!data.success) throw new Error("API: Not Success");
            setEmotions(data.emotions || {});
          })
          .catch(() => setError("Could not load emotions"))
          .finally(() => setLoading(false));
      })
      .catch(() => {
        setError("Could not save emotion. Try again.");
        setLoading(false);
      });
  }

  // Responsive: grid
  // Find what ISO dates to render (all days in this month)
  // Calendar always starts from Sunday
  const firstDayIdx = first.getDay();
  const gridCells = [];
  for (let i = 0; i < firstDayIdx; ++i) gridCells.push(null);
  for (let d = 1; d <= numDays; ++d) gridCells.push(new Date(year, month, d));
  while (gridCells.length % 7 !== 0) gridCells.push(null);

  // Pastel accent for today’s date, subtle color for the rest
  function cellStyle(d, idx) {
    if (!d) 
      return { background: "none", border: "none" };
    if (
      d.getDate() === today.getDate() &&
      d.getMonth() === today.getMonth() &&
      d.getFullYear() === today.getFullYear()
    ) {
      return {
        background: pastelPalette[2],
        border: `2.5px solid ${pastelPalette[3]}`,
        color: "#32204a",
        fontWeight: 700,
        cursor: "pointer",
        boxShadow: "0 2px 10px #eadafc55"
      };
    }
    return {
      background: (idx % 2 === 0 ? pastelPalette[0] : pastelPalette[1]),
      border: "1px solid #F3E6FC",
      color: "#574d82",
      fontWeight: 500
    };
  }

  // Responsive - maxWidth 100%, grid, padding
  return (
    <section
      aria-label="Monthly Emotion Calendar"
      style={{
        ...style,
        background: "rgba(255,255,255,0.98)",
        borderRadius: 22,
        boxShadow: "0 2px 12px rgba(104,127,229,0.09)",
        padding: "20px 12px 18px 12px",
        width: "100%",
        maxWidth: 488,
        minWidth: 0,
        transition: "box-shadow 0.2s, padding 0.15s",
        margin: "0 auto"
      }}
    >
      {/* Header */}
      <div style={{
        width: "100%", display: "flex", alignItems: "center",
        justifyContent: "space-between", marginBottom: 7, gap: 4
      }}>
        <span style={{
          fontWeight: 700, color: pastelPalette[3],
          fontSize: "1.25rem", letterSpacing: 0.02,
        }}>
            {today.toLocaleString("default", { month: "long", year: "numeric" })}
        </span>
        <span style={{ fontSize: "1.03em", color: "#8D76A7", fontWeight: 500 }}>
          Track your mood
        </span>
      </div>
      {/* Week headers */}
      <div style={{
        display: "grid", gridTemplateColumns: "repeat(7, 1fr)",
        fontWeight: 700, color: "#af8edc", fontSize: "1.09em",
        marginBottom: 0, paddingLeft: 3, paddingRight: 3
      }}>
        {["S", "M", "T", "W", "T", "F", "S"].map(wd => (
          <div key={wd} style={{ textAlign: "center" }}>{wd}</div>
        ))}
      </div>
      {/* Calendar grid */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(7, 1fr)",
        gap: 3,
        marginTop: 6,
        marginBottom: 0
      }}>
        {gridCells.map((d, idx) => {
          const iso = d ? toISO(d) : null;
          const isToday =
            d &&
            d.getDate() === today.getDate() &&
            d.getMonth() === today.getMonth() &&
            d.getFullYear() === today.getFullYear();
          return (
            <div
              key={idx}
              style={{
                ...cellStyle(d, idx),
                position: "relative",
                aspectRatio: "1/1",
                minHeight: 0,
                minWidth: 0,
                borderRadius: 16,
                userSelect: isToday ? "auto" : "none",
                cursor: isToday ? "pointer" : "default",
                transition: "background 0.16s, border 0.15s"
              }}
              tabIndex={isToday ? 0 : -1}
              aria-label={
                d
                  ? isToday
                    ? "Today: select or edit your emotion"
                    : "Day " + d.getDate() + (emotions && emotions[iso] ? `, emotion: ${emotions[iso]}` : "")
                  : ""
              }
              onClick={isToday ? () => handleDayClick(d.getDate()) : undefined}
            >
              {/* Day number */}
              {d && (
                <span
                  style={{
                    fontWeight: isToday ? 800 : 600,
                    fontSize: "1.07em",
                    letterSpacing: 0,
                    color: isToday ? "#2d1157" : "#6E609A",
                    marginBottom: 2
                  }}
                >
                  {d.getDate()}
                </span>
              )}
              {/* Emoji overlay if set */}
              {emotions && emotions[iso] && (
                <span
                  style={{
                    position: "absolute",
                    bottom: 5, left: "49%",
                    transform: "translateX(-50%)",
                    fontSize: isToday ? 26 : 23,
                    filter: isToday ? "drop-shadow(0 1px 4px #d2bafc66)" : "none",
                    cursor: isToday ? "pointer" : "default",
                    pointerEvents: "none"
                  }}
                  aria-label={`Emotion: ${emotions[iso]}`}
                  role="img"
                >
                  {emotions[iso]}
                </span>
              )}
            </div>
          );
        })}
      </div>
      {/* Modal to pick emoji (for today) */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
        <h2 style={{ fontWeight: 700, color: pastelPalette[3], fontSize: "1.22rem", margin: 0, textAlign: "center" }}>
          How are you feeling today? <span style={{ fontSize: 16 }}>Pick one:</span>
        </h2>
        <div
          style={{
            marginTop: 17,
            display: "grid",
            gridTemplateColumns: "repeat(7, 1fr)",
            gap: 6,
            maxHeight: 222,
            overflowY: "auto",
            borderRadius: 10,
            background: "#F5F2FF",
            padding: "10px 0"
          }}
        >
          {EMOTION_EMOJIS.map(emoji => (
            <button
              key={emoji}
              style={{
                fontSize: 24,
                padding: "7px 0",
                background: "none",
                border: "none",
                cursor: "pointer",
                borderRadius: 8,
                outline: "none",
                transition: "background .13s",
                filter: chosen === emoji ? "contrast(1.2)" : "none",
                boxShadow: chosen === emoji ? "0 2px 8px #f3e9fd99" : "none"
              }}
              title={emoji}
              tabIndex={0}
              onClick={() => handleSaveEmotion(emoji)}
              aria-label={`Select emotion ${emoji}`}
            >
              {emoji}
            </button>
          ))}
        </div>
        <div style={{ marginTop: 16, textAlign: "center" }}>
          <button
            type="button"
            style={{
              background: pastelPalette[3],
              color: "#fff",
              fontWeight: 700,
              borderRadius: 18,
              border: "none",
              padding: "7.5px 31px",
              fontSize: "1.06em",
              marginTop: 6,
              cursor: "pointer",
              boxShadow: "0 1.5px 7px #d5d3e6cc",
              transition: "background .15s"
            }}
            onClick={() => setModalOpen(false)}
          >
            Cancel
          </button>
        </div>
      </Modal>
      {/* Loading/Error */}
      {loading && (
        <div style={{
          textAlign: "center", color: "#7766A6",
          marginTop: 11, fontSize: "1em"
        }}>
          Loading...
        </div>
      )}
      {error && (
        <div style={{
          textAlign: "center", color: "#f56d7b",
          marginTop: 8, fontWeight: 600
        }}>
          {error}
        </div>
      )}
    </section>
  );
}

export default CalendarWithEmotions;

