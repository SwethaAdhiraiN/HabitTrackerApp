import React from "react";
import styles from "./styles/Dashboard.module.css";

/**
 * PUBLIC_INTERFACE
 * QuoteOfTheDayWidget displays a motivational quote and its author in a pastel, rounded container styled to match the Dashboard.
 * Ensures highly visible, accessible text with dashboard-wide pastel palette. Defaults to a positive preset if no quote is provided.
 * 
 * Props:
 *   quoteObj: {text: string, author: string}
 */
function QuoteOfTheDayWidget({ quoteObj }) {
  // If no quoteObj provided, use fallback
  if (!quoteObj) {
    quoteObj = {
      text: "Start where you are. Use what you have. Do what you can.",
      author: "Arthur Ashe",
    };
  }

  // Section: Dashboard pastel card for quote of the day
  return (
    <section className={styles.quoteWidgetContainer} data-testid="quote-of-day-widget">
      <div className={styles.quoteText}>
        {"\u201C"}
        {quoteObj.text}
        {"\u201D"}
      </div>
      <div className={styles.quoteAuthor}>
        — {quoteObj.author}
      </div>
    </section>
  );
}

export default QuoteOfTheDayWidget;
