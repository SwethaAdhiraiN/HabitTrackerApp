import React, { useState } from "react";

/**
 * PUBLIC_INTERFACE
 * CalendarWithEmotions shows a calendar grid with one emoji per day.
 * Only today's cell is interactive for adding/removing emotions.
 * For today: shows a full emoji/smilies palette and a "remove/clear" button.
 * Past/future dates are non-interactive and display only.
 */

/**
 * Full palette of emoji/smilies for emotional status selection.
 * Wide coverage for an expressive range (not just the limited demo set).
 */
const EMOTION_PALETTE = [
  "😀", "😃", "😄", "😁", "😆", "😅", "😂", "😊", "😇",
  "🙂", "🙃", "😉", "😌", "😍", "🥰", "😘", "😗", "😙", "😚",
  "😋", "😛", "😜", "😝", "🤑", "🤗", "🤩",
  "😏", "😒", "😞", "😔", "😟", "😕", "🙁", "☹️", "😣",
  "😖", "😫", "😩", "🥺", "😢", "😭", "😤", "😠", "😡",
  "🤬", "🤯", "😳", "🥵", "🥶", "😱", "😨", "😰",
  "😥", "😓", "🤔", "🤭", "🤫", "🤥", "😶", "😑", "😐"
];

/**
 * Returns a 2D array representing weeks for a calendar month.
 * Each entry is { date, isCurrentMonth, isToday }.
 */
function getMonthWeeks(year, month) {
  // Defensive: ensure year/month are numbers and valid
  const today = new Date();
  let safeYear = Number.isFinite(year) && year > 1970 ? year : today.getFullYear();
  let safeMonth = Number.isFinite(month) && month >= 0 && month <= 11 ? month : today.getMonth();

  const firstDay = new Date(safeYear, safeMonth, 1);
  const startDay = firstDay.getDay(); // 0 (Sun) - 6 (Sat)
  const weeks = [];
  // Defensive: if startDay is NaN, fallback to Sunday (should never be NaN now)
  let dayOffset = Number.isFinite(startDay) ? startDay : 0;
  let current = new Date(safeYear, safeMonth, 1 - dayOffset);

  for (let week = 0; week < 6; week++) {
    let weekArr = [];
    for (let day = 0; day < 7; day++) {
      let d = new Date(current);
      // Defensive: avoid bad date case
      weekArr.push({
        date: isNaN(d.getTime()) ? null : d,
        isCurrentMonth: isNaN(d.getTime()) ? false : d.getMonth() === safeMonth,
        isToday:
          !isNaN(d.getTime()) &&
          d.getFullYear() === today.getFullYear() &&
          d.getMonth() === today.getMonth() &&
          d.getDate() === today.getDate(),
      });
      current.setDate(current.getDate() + 1);
    }
    weeks.push(weekArr);
  }
  return weeks;
}

/**
 * CalendarWithEmotions
 *
 * @param {{
 *   emotionsPerDay: Object.<string, string>, // e.g. {"2024-06-28": "😀"}, keyed by YYYY-MM-DD
 *   onEmotionChange: function(dateStr, emoji): void,
 *   month: number, // 0 = Jan
 *   year: number,
 * }} props
 */
function CalendarWithEmotions({
  emotionsPerDay,
  onEmotionChange,
  month,
  year,
}) {
  const [pickerOpen, setPickerOpen] = useState(false);

  // Defensive: sanitize props
  const todayObj = new Date();
  const safeYear = Number.isFinite(year) && year > 1970 ? year : todayObj.getFullYear();
  const safeMonth = Number.isFinite(month) && month >= 0 && month <= 11 ? month : todayObj.getMonth();

  // Compute today's "YYYY-MM-DD" string
  const todayStr = `${todayObj.getFullYear()}-${String(
    todayObj.getMonth() + 1
  ).padStart(2, "0")}-${String(todayObj.getDate()).padStart(2, "0")}`;

  const weeks = getMonthWeeks(safeYear, safeMonth);

  // Show picker only for today's cell if clicked
  function handleCellClick(day) {
    const isToday = day.isToday && day.isCurrentMonth;
    if (isToday) {
      setPickerOpen(true);
    }
  }

  // Handles selection of emotion or removal ("")
  function handlePickEmotion(emoji) {
    onEmotionChange(todayStr, emoji); // emoji can be "" to unset
    setPickerOpen(false);
  }

  function handleClosePicker() {
    setPickerOpen(false);
  }

  return (
    <div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(7, 1fr)",
          gap: 6,
          background: "rgba(245,241,255,0.82)",
          borderRadius: 14,
          padding: 10,
        }}
      >
        {/* Day labels row */}
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((label) => (
          <div
            key={label}
            style={{
              textAlign: "center",
              fontWeight: 600,
              color: "var(--ht-primary)",
              letterSpacing: 0.3,
              fontSize: 13,
              marginBottom: 3,
              userSelect: "none",
              background: "none",
              borderRadius: 7,
            }}
          >
            {label}
          </div>
        ))}
        {/* Calendar days */}
        {weeks.flat().map((day, idx) => {
          const thisDayStr = `${day.date.getFullYear()}-${String(
            day.date.getMonth() + 1
          ).padStart(2, "0")}-${String(day.date.getDate()).padStart(2, "0")}`;
          const emotion = emotionsPerDay?.[thisDayStr] || "";
          const isToday = day.isToday && day.isCurrentMonth;
          return (
            <div
              key={idx}
              tabIndex={isToday ? 0 : -1}
              aria-label={
                isToday
                  ? `Today, ${day.date.toDateString()}. ${
                      emotion ? "Emotion: " + emotion : "No emotion set"
                    }. Click to set or remove emotion.`
                  : `${day.date.toDateString()}. ${emotion ? "Emotion: " + emotion : "No emotion"}.`
              }
              style={{
                padding: 0,
                minHeight: 46,
                borderRadius: 8,
                background: isToday
                  ? "rgba(104,127,229,0.15)"
                  : day.isCurrentMonth
                  ? "rgba(255,255,255,0.95)"
                  : "rgba(245,241,255,0.63)",
                border: isToday
                  ? "2px solid #687FE5"
                  : day.isCurrentMonth
                  ? "1.2px solid #E2D6F7"
                  : "1.2px solid #f1e9ff",
                cursor: isToday ? "pointer" : "not-allowed",
                transition: "background 0.16s, border 0.2s",
                boxShadow:
                  isToday
                    ? "0 2px 8px rgba(104,127,229,0.09)"
                    : "none",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: day.isCurrentMonth ? 600 : 400,
                color: "#27194f",
                fontSize: 16,
                position: "relative",
                outline: isToday && pickerOpen ? "2px solid #A188FF" : "none",
              }}
              onClick={() => handleCellClick(day)}
            >
              <span style={{ fontSize: 11, opacity: 0.7, marginBottom: 2 }}>
                {day.date && !isNaN(day.date.getTime()) ? day.date.getDate() : ""}
              </span>
              <span style={{ fontSize: 23, margin: "0 0 3px 0" }}>
                {emotion}
              </span>
              {/* Show picker overlay if this is today and pickerOpen */}
              {isToday && pickerOpen && (
                <div
                  style={{
                    position: "absolute",
                    top: 37,
                    left: "50%",
                    transform: "translateX(-50%)",
                    zIndex: 10,
                    background: "white",
                    border: "1.2px solid #E2D6F7",
                    borderRadius: 12,
                    boxShadow: "0 6px 30px rgba(145,107,195,0.14)",
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "7px 7px",
                    padding: "10px 9px 6px 9px",
                    minWidth: 230,
                    maxWidth: 324,
                    maxHeight: 142,
                    overflowY: "auto",
                  }}
                  onClick={(e) => e.stopPropagation()}
                  aria-modal="true"
                  role="dialog"
                >
                  {EMOTION_PALETTE.map((e) => (
                    <button
                      key={e}
                      style={{
                        fontSize: 22,
                        background: "none",
                        border: "none",
                        padding: "2px 2px",
                        cursor: "pointer",
                        borderRadius: 8,
                        outline: "none",
                        transition: "box-shadow 0.14s",
                        boxShadow:
                          emotionsPerDay?.[todayStr] === e
                            ? "0 0 0 2px #687FE5"
                            : "none",
                      }}
                      tabIndex={0}
                      onClick={() => handlePickEmotion(e)}
                      aria-label={`Set emotion to ${e}`}
                    >
                      {e}
                    </button>
                  ))}
                  <button
                    style={{
                      fontSize: 18,
                      color: "#888",
                      marginLeft: 8,
                      padding: "4px 11px",
                      border: "1.1px solid #EBE6FB",
                      background: "#F8F7FC",
                      borderRadius: 8,
                      cursor: "pointer",
                      fontWeight: 600,
                      alignSelf: "center",
                    }}
                    tabIndex={0}
                    onClick={() => handlePickEmotion("")}
                    aria-label="Remove today's emotion"
                  >
                    Clear
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
      {pickerOpen && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            zIndex: 8,
            background: "rgba(80,60,170,0.04)",
          }}
          onClick={handleClosePicker}
          aria-hidden="true"
        />
      )}
    </div>
  );
}

export default CalendarWithEmotions;
