import React from "react";
import "./styles/Dashboard.module.css";

/**
 * PUBLIC_INTERFACE
 * QuoteOfTheDayWidget: Renders quote and author, with refresh action.
 */
function QuoteOfTheDayWidget({ quote, onRefresh }) {
  const defaultQuote = {
    quote: "Start small. Be consistent. Good habits shape your future!",
    author: "HabitTrackerApp",
  };
  const q = quote || defaultQuote;
  return (
    <section className="dashboard-card quote-of-the-day">
      <div className="dashboard-card-title">
        Quote of the Day
        <button className="quote-refresh-btn" onClick={onRefresh} title="New Quote">
          ↻
        </button>
      </div>
      <div className="quote-body">
        “{q.quote}”
        <div className="quote-author">— {q.author}</div>
      </div>
    </section>
  );
}

export default QuoteOfTheDayWidget;
