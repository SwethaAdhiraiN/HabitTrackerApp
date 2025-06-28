import React, { useState } from "react";
import "./styles/Dashboard.module.css";

const EMOTIONS = [
  { emoji: "😀", label: "Happy" },
  { emoji: "😐", label: "Okay" },
  { emoji: "😢", label: "Sad" },
  { emoji: "😡", label: "Angry" },
  { emoji: "😱", label: "Stressed" },
  { emoji: "🤩", label: "Proud" },
];

// Helper: Get date string YYYY-MM-DD N days ago
function daysAgo(n) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString().slice(0, 10);
}

/**
 * PUBLIC_INTERFACE
 * CalendarWithEmotions: Mini calendar for past 14 days; shows logged emotions & reflection notes, allows log.
 */
function CalendarWithEmotions({ emotionData = [], reflections = {}, onLogEmotion }) {
  const [showLog, setShowLog] = useState(null); // date being edited
  const [chosenEmotion, setChosenEmotion] = useState(null);
  const [note, setNote] = useState("");

  // Generate days: last 14 days
  const today = new Date();
  const dates = [];
  for (let i = 13; i >= 0; i--) {
    const dt = new Date();
    dt.setDate(today.getDate() - i);
    dates.push(dt.toISOString().slice(0, 10));
  }

  // Map: date => emotion {emoji, label}, note
  const emotionsMap = {};
  for (const entry of emotionData) {
    emotionsMap[entry.date] = { emoji: entry.emoji, label: entry.label, note: entry.note || "" };
  }

  // Popover/log panel
  const openLogPanel = (date) => {
    setShowLog(date);
    setChosenEmotion(emotionsMap[date]?.label || null);
    setNote(emotionsMap[date]?.note || "");
  };

  const save = () => {
    if (chosenEmotion)
      onLogEmotion(showLog, chosenEmotion, note || "");
    setShowLog(null);
    setNote("");
    setChosenEmotion(null);
  };

  return (
    <div className="minicalendar-root">
      <div className="minicalendar-row">
        {dates.map((date) => {
          const emotion = emotionsMap[date] || {};
          const ref = reflections[date];
          return (
            <div
              key={date}
              className={`minicalendar-day${showLog === date ? " edit" : ""}`}
              title={`${date}${emotion.label ? `: ${emotion.label}` : ""}${emotion.note ? `\n${emotion.note}` : ""}${ref ? `\nReflection: ${ref}` : ""}`}
              style={emotion.emoji ? { background: "#E9F7EE", borderColor: "#56caa2" } : undefined}
              onClick={() => openLogPanel(date)}
            >
              <div className="minicalendar-date">{date.slice(8)}</div>
              <div className="minicalendar-emo">{emotion.emoji || "•"}</div>
            </div>
          );
        })}
      </div>
      {showLog && (
        <div className="minicalendar-log-modal">
          <div>
            <b>Log your feeling for {showLog}</b>
            <div className="minicalendar-emo-selector">
              {EMOTIONS.map((emo) => (
                <button
                  key={emo.label}
                  className={chosenEmotion === emo.label ? "chosen" : ""}
                  onClick={() => setChosenEmotion(emo.label)}
                  type="button"
                >
                  {emo.emoji}
                </button>
              ))}
            </div>
            <textarea
              value={note}
              placeholder="Reflection/note (optional)"
              onChange={(e) => setNote(e.target.value)}
              rows={2}
              maxLength={120}
              style={{ width: "100%", marginTop: 6, borderRadius: 6, padding: 4, border: "1px solid #def" }}
            />
            <div style={{ marginTop: 8 }}>
              <button className="save-btn" disabled={!chosenEmotion} onClick={save}>
                Save
              </button>{" "}
              <button className="cancel-btn" onClick={() => setShowLog(null)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CalendarWithEmotions;
